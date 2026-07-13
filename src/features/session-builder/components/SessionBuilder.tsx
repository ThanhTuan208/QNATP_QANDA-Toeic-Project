'use client'

import { useCallback } from 'react'
import { generateSessionQuestions } from '@/features/session-builder/client/session.client'
import { Step1Scope } from '@/features/session-builder/components/Step1Scope'
import { Step2Config } from '@/features/session-builder/components/Step2Config'
import { Step3Source } from '@/features/session-builder/components/Step3Source'
import { Step4Preview } from '@/features/session-builder/components/Step4Preview'
import { Step5Practice } from '@/features/session-builder/components/Step5Practice'
import { StepNavigation } from '@/features/session-builder/components/StepNavigation'
import { useSessionBuilder } from '@/features/session-builder/hooks/useSessionBuilder'
import { buildPracticeSession } from '@/features/session-builder/utils/questions'
import { processImportedSessionJSON } from '@/features/session-builder/utils/validation'
import { useTempSession } from '@/features/temp-session/hooks/useTempSession'
import type { SessionAttempt } from '@/features/temp-session/types'

export function SessionBuilder() {
  const wizard = useSessionBuilder()
  const tempSession = useTempSession()

  const handleScopeChange = useCallback(
    (scope: Parameters<typeof wizard.setScope>[0]) => {
      wizard.setScope(scope)
    },
    [wizard.setScope],
  )

  const handlePresetChange = useCallback(
    (preset: Parameters<typeof wizard.setPreset>[0]) => {
      wizard.setPreset(preset)
    },
    [wizard.setPreset],
  )

  const handleConfigChange = useCallback(
    (config: Parameters<typeof wizard.setConfig>[0]) => {
      wizard.setConfig(config)
    },
    [wizard.setConfig],
  )

  const handleSourceChange = useCallback(
    (source: Parameters<typeof wizard.setSource>[0]) => {
      wizard.setSource(source)
    },
    [wizard.setSource],
  )

  const handleImportJsonChange = useCallback(
    (json: string) => {
      wizard.setImportJson(json)
    },
    [wizard.setImportJson],
  )

  const handleValidationErrorsChange = useCallback(
    (errors: string[]) => {
      wizard.setValidationErrors(errors)
    },
    [wizard.setValidationErrors],
  )

  const handleNext = useCallback(async () => {
    if (wizard.state.step !== 'source') {
      wizard.nextStep()
      return
    }

    if (wizard.state.source === 'imported' && wizard.state.importJson) {
      const result = processImportedSessionJSON(wizard.state.importJson, wizard.state.config)
      if (result.success) {
        wizard.setQuestions(result.questions)
      }
      wizard.nextStep()
      return
    }

    if (wizard.state.source === 'system') {
      wizard.setGenerating(true)
      wizard.setGenerationError('')
      try {
        const { scope, config } = wizard.state
        const { questions } = await generateSessionQuestions({
          parts: scope.parts,
          knowledgeGroups: config.knowledgeGroups ?? {},
          difficulty: config.difficulty ?? ['medium'],
          totalQuestions: config.totalQuestions ?? 20,
        })
        wizard.setQuestions(questions)
        wizard.setGenerating(false)
        wizard.nextStep()
      } catch (e) {
        wizard.setGenerating(false)
        wizard.setGenerationError(
          e instanceof Error ? e.message : 'Unknown error generating questions',
        )
      }
    }
  }, [wizard])

  const handleStartPractice = useCallback(async () => {
    if (wizard.state.questions.length === 0) return

    const sessionId = crypto.randomUUID()
    const partial = buildPracticeSession({
      ...wizard.state,
    })
    const session = { ...partial, id: sessionId, userId: 'anonymous' }
    await tempSession.save(session)

    wizard.nextStep()
  }, [wizard, tempSession])

  const handlePracticeComplete = useCallback(
    async (attempts: SessionAttempt[]) => {
      const allSessions = await tempSession.getAll()
      const currentSession = allSessions.find(
        (s) => s.config.source === wizard.state.source && s.status === 'active',
      )
      if (currentSession) {
        for (const attempt of attempts) {
          await tempSession.updateAttempt(attempt)
        }
        await tempSession.updateIndex(attempts.length)
      }
    },
    [tempSession, wizard.state.source],
  )

  return (
    <div className='max-w-2xl mx-auto py-6'>
      {wizard.state.step === 'scope' && (
        <Step1Scope scope={wizard.state.scope} onScopeChange={handleScopeChange} />
      )}

      {wizard.state.step === 'config' && (
        <Step2Config
          parts={wizard.state.scope.parts}
          preset={wizard.state.preset}
          config={wizard.state.config}
          onPresetChange={handlePresetChange}
          onConfigChange={handleConfigChange}
        />
      )}

      {wizard.state.step === 'source' && (
        <Step3Source
          source={wizard.state.source}
          config={wizard.state.config}
          importJson={wizard.state.importJson}
          validationErrors={wizard.state.validationErrors}
          onSourceChange={handleSourceChange}
          onImportJsonChange={handleImportJsonChange}
          onValidationErrorsChange={handleValidationErrorsChange}
        />
      )}

      {wizard.state.step === 'preview' && (
        <Step4Preview
          preset={wizard.state.preset}
          config={wizard.state.config}
          source={wizard.state.source}
          questions={wizard.state.questions}
          onBack={wizard.prevStep}
          onStart={handleStartPractice}
          isGenerating={wizard.state.isGenerating}
          generationError={wizard.state.generationError}
        />
      )}

      {wizard.state.step === 'practice' && (
        <Step5Practice
          questions={wizard.state.questions}
          onBack={wizard.prevStep}
          onComplete={handlePracticeComplete}
        />
      )}

      {wizard.state.step !== 'practice' && (
        <StepNavigation
          currentStep={wizard.currentStepIndex()}
          totalSteps={wizard.totalSteps()}
          canGoBack={wizard.canGoPrev()}
          canGoNext={wizard.canGoNext()}
          onBack={wizard.prevStep}
          onNext={handleNext}
          loading={wizard.state.isGenerating}
        />
      )}
    </div>
  )
}
