'use client'

import { StepNavigation } from '@/features/session-builder/components/StepNavigation'
import {
  Step1Scope,
  Step2Config,
  Step3Source,
  Step4Preview,
  Step5Practice,
} from '@/features/session-builder/components/steps'
import { usePracticeSession } from '@/features/session-builder/hooks/usePracticeSession'
import { useQuestionGeneration } from '@/features/session-builder/hooks/useQuestionGeneration'
import { useSessionBuilder } from '@/features/session-builder/hooks/useSessionBuilder'
import { useTempSession } from '@/features/temp-session/hooks/useTempSession'

export function SessionBuilder() {
  const wizard = useSessionBuilder()
  const tempSession = useTempSession()

  const { handleNext } = useQuestionGeneration(wizard.state, {
    setQuestions: wizard.setQuestions,
    setGenerating: wizard.setGenerating,
    setGenerationError: wizard.setGenerationError,
    nextStep: wizard.nextStep,
  })

  const { handleStartPractice, handlePracticeComplete } = usePracticeSession(
    wizard.state,
    wizard.nextStep,
    {
      save: tempSession.save,
      getAll: tempSession.getAll,
      updateAttempt: tempSession.updateAttempt,
      updateIndex: tempSession.updateIndex,
    },
  )

  return (
    <div className='max-w-2xl mx-auto py-6'>
      {wizard.state.step === 'scope' && (
        <Step1Scope scope={wizard.state.scope} onScopeChange={wizard.setScope} />
      )}

      {wizard.state.step === 'config' && (
        <Step2Config
          parts={wizard.state.scope.parts}
          preset={wizard.state.preset}
          config={wizard.state.config}
          onPresetChange={wizard.setPreset}
          onConfigChange={wizard.setConfig}
        />
      )}

      {wizard.state.step === 'source' && (
        <Step3Source
          source={wizard.state.source}
          config={wizard.state.config}
          importJson={wizard.state.importJson}
          validationErrors={wizard.state.validationErrors}
          onSourceChange={wizard.setSource}
          onImportJsonChange={wizard.setImportJson}
          onValidationErrorsChange={wizard.setValidationErrors}
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
