/*
  Warnings:

  - You are about to drop the column `code` on the `questions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "questions_code_key";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "code";
