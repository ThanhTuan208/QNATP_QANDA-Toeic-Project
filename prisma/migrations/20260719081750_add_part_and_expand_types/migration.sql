-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'MODAL_VERBS';
ALTER TYPE "QuestionType" ADD VALUE 'CONDITIONALS';
ALTER TYPE "QuestionType" ADD VALUE 'INFINITIVE_GERUND';
ALTER TYPE "QuestionType" ADD VALUE 'PARALLEL_STRUCTURE';
ALTER TYPE "QuestionType" ADD VALUE 'PRONOUN';
ALTER TYPE "QuestionType" ADD VALUE 'DETERMINER_QUANTIFIER';
ALTER TYPE "QuestionType" ADD VALUE 'SENTENCE_INSERTION';
ALTER TYPE "QuestionType" ADD VALUE 'GRAMMAR';
ALTER TYPE "QuestionType" ADD VALUE 'TRANSITION';
ALTER TYPE "QuestionType" ADD VALUE 'MAIN_IDEA';
ALTER TYPE "QuestionType" ADD VALUE 'DETAIL';
ALTER TYPE "QuestionType" ADD VALUE 'INFERENCE';
ALTER TYPE "QuestionType" ADD VALUE 'VOCABULARY_IN_CONTEXT';
ALTER TYPE "QuestionType" ADD VALUE 'REFERENCE';
ALTER TYPE "QuestionType" ADD VALUE 'INTENTION';
ALTER TYPE "QuestionType" ADD VALUE 'NOT_QUESTION';

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "part" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "passageText" TEXT;
