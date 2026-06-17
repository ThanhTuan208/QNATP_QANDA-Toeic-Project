import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const session = await auth();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const [totalAttempts, correctAttempts, allAttempts, recentAttempts] =
		await Promise.all([
			prisma.attempt.count({ where: { userId: session.user.id } }),
			prisma.attempt.count({
				where: { userId: session.user.id, isCorrect: true },
			}),
			prisma.attempt.findMany({
				where: { userId: session.user.id },
				select: {
					isCorrect: true,
					question: { select: { type: true } },
				},
			}),
			prisma.attempt.findMany({
				where: { userId: session.user.id },
				orderBy: { createdAt: "desc" },
				take: 10,
				include: {
					question: {
						select: { type: true, difficulty: true },
					},
				},
			}),
		]);

	const typeMap = new Map<string, { total: number; correct: number }>();
	for (const a of allAttempts) {
		const key = a.question.type;
		const entry = typeMap.get(key) ?? { total: 0, correct: 0 };
		entry.total++;
		if (a.isCorrect) entry.correct++;
		typeMap.set(key, entry);
	}

	return NextResponse.json({
		totalAttempts,
		correctAttempts,
		accuracy:
			totalAttempts > 0
				? Math.round((correctAttempts / totalAttempts) * 100)
				: 0,
		typeStats: Object.fromEntries(typeMap),
		recentAttempts,
	});
}
