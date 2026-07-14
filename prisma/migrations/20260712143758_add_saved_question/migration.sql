-- CreateTable
CREATE TABLE "saved_questions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saved_questions_userId_idx" ON "saved_questions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_questions_userId_questionId_key" ON "saved_questions"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "saved_questions" ADD CONSTRAINT "saved_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_questions" ADD CONSTRAINT "saved_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
