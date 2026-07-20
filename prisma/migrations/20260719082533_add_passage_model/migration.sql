-- CreateEnum
CREATE TYPE "PassageFormat" AS ENUM ('SINGLE', 'DOUBLE', 'TRIPLE');

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "passageId" TEXT;

-- CreateTable
CREATE TABLE "passages" (
    "id" TEXT NOT NULL,
    "passageGroupId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "part" INTEGER NOT NULL,
    "passageFormat" "PassageFormat" NOT NULL DEFAULT 'SINGLE',
    "content" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "passages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "passages_passageGroupId_idx" ON "passages"("passageGroupId");

-- CreateIndex
CREATE INDEX "questions_passageId_idx" ON "questions"("passageId");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "passages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
