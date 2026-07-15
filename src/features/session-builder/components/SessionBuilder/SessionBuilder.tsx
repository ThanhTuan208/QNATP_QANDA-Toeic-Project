'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { stepTransition } from '@/components/common/AnimatedStep'
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
    <div className='max-w-4xl mx-auto py-6 space-y-6'>
      <AnimatePresence mode='popLayout'>
        {wizard.state.step === 'scope' && (
          <motion.div key='scope' {...stepTransition}>
        <div className='bg-card rounded-2xl border border-border/50 px-10 -mx-10 py-6 shadow-sm'>
              <Step1Scope scope={wizard.state.scope} onScopeChange={wizard.setScope} />
            </div>
          </motion.div>
        )}

        {wizard.state.step === 'config' && (
          <motion.div key='config' {...stepTransition}>
            <div className='bg-card rounded-2xl border border-border/50 px-10 -mx-10 py-6 shadow-sm'>
              <Step2Config
                parts={wizard.state.scope.parts}
                preset={wizard.state.preset}
                config={wizard.state.config}
                onPresetChange={wizard.setPreset}
                onConfigChange={wizard.setConfig}
              />
            </div>
          </motion.div>
        )}

        {wizard.state.step === 'source' && (
          <motion.div key='source' {...stepTransition}>
            <div className='bg-card rounded-2xl border border-border/50 px-10 -mx-10 py-6 shadow-sm'>
              <Step3Source
                source={wizard.state.source}
                config={wizard.state.config}
                importJson={wizard.state.importJson}
                validationErrors={wizard.state.validationErrors}
                onSourceChange={wizard.setSource}
                onImportJsonChange={wizard.setImportJson}
                onValidationErrorsChange={wizard.setValidationErrors}
              />
            </div>
          </motion.div>
        )}

        {wizard.state.step === 'preview' && (
          <motion.div key='preview' {...stepTransition}>
            <div className='bg-card rounded-2xl border border-border/50 px-10 -mx-10 py-6 shadow-sm'>
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
            </div>
          </motion.div>
        )}

        {wizard.state.step === 'practice' && (
          <motion.div key='practice' {...stepTransition}>
            <div className='bg-card rounded-2xl border border-border/50 px-10 -mx-10 py-6 shadow-sm'>
              <Step5Practice
                questions={wizard.state.questions}
                onBack={wizard.prevStep}
                onComplete={handlePracticeComplete}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
