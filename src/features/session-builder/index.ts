export { SessionBuilder } from './components/SessionBuilder'
export {
  DEFAULT_DIFFICULTY,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  IMPORT_TEMPLATE,
  KNOWLEDGE_GROUPS,
  PART_GROUPS,
  PART_LABELS,
  PRESETS,
  WIZARD_STEPS,
} from './constants'
export { useSessionBuilder } from './hooks/useSessionBuilder'
export type {
  PresetOption,
  PresetType,
  ScopeConfig,
  SessionBuilderAction,
  SessionBuilderState,
  SessionBuilderStep,
  UseSessionBuilderReturn,
  ValidationError,
  ValidationResult,
} from './types'
export {
  attemptRecordToSessionAttempt,
  buildPracticeSession,
  calculateTotalQuestions,
  getDefaultKnowledgeGroups,
  getKnowledgeGroupLabel,
  getKnowledgeGroupsForPart,
  getNextStep,
  getPresetConfig,
  getPrevStep,
  parseImportedSessionJSON,
  processImportedSessionJSON,
  sessionQuestionsToQuizQuestions,
  sessionQuestionToQuizQuestion,
  toggleDifficulty,
  togglePartSelection,
  updateKnowledgeGroupCount,
  validateImportedQuestions,
} from './utils'
