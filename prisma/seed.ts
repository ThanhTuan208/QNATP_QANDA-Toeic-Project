import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type QuestionType } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const isReset = process.argv.includes("--reset");

const questions = JSON.parse(
  readFileSync(join(__dirname, "..", "data", "questions.json"), "utf-8"),
);

const TYPE_MAP: Record<string, QuestionType> = {
  "word-form": "WORD_FORM",
  vocabulary: "VOCABULARY",
  "verb-tense": "VERB_TENSE",
  preposition: "PREPOSITION",
  conjunction: "CONJUNCTION",
  participle: "PARTICIPLE",
  voice: "VOICE",
  "relative-clause": "RELATIVE_CLAUSE",
  comparison: "COMPARISON",
  agreement: "AGREEMENT",
};

async function main() {
  if (isReset) {
    // Xoa du lieu cu neu reset
    await prisma.attempt.deleteMany();
    await prisma.option.deleteMany();
    await prisma.question.deleteMany();
  }

  const data = questions as any[];
  console.log(`Seeding ${data.length} questions...`);

  for (const q of data) {
    const questionData = {
      questionText: q.question,
      type: TYPE_MAP[q.type] || "WORD_FORM",
      difficulty: (q.difficulty || "medium").toUpperCase(),
      source: "ADMIN_IMPORT" as const,
      hint: q.hint || null,
    };

    const questionId = q.code;

    if (isReset) {
      await prisma.question.create({
        data: {
          id: questionId,
          ...questionData,
          options: {
            create: q.options.map((opt: any, idx: number) => ({
              id: `${questionId}_${idx + 1}`,
              text: opt.text,
              isCorrect: opt.isCorrect,
              rationale: opt.rationale,
              order: idx,
            })),
          },
        },
      });
    } else {
      const existing = await prisma.question.findUnique({
        where: { id: questionId },
      });

      if (existing) {
        await prisma.question.update({
          where: { id: questionId },
          data: questionData,
        });
      } else {
        await prisma.question.create({
          data: {
            id: questionId,
            ...questionData,
            options: {
              create: q.options.map((opt: any, idx: number) => ({
                id: `${questionId}_${idx + 1}`,
                text: opt.text,
                isCorrect: opt.isCorrect,
                rationale: opt.rationale,
                order: idx,
              })),
            },
          },
        });
      }
    }
  }

  console.log(`Seeded ${data.length} questions successfully`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
