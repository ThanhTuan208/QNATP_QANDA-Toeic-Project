import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
	const session = await auth();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { questionId, selectedOptionId, timeSpentSeconds } = body;

	if (!questionId || !selectedOptionId) {
		return NextResponse.json(
			{ error: "questionId and selectedOptionId are required" },
			{ status: 400 },
		);
	}

	const question = await prisma.question.findUnique({
		where: { id: questionId },
		include: { options: true },
	});

	if (!question) {
		return NextResponse.json({ error: "Question not found" }, { status: 404 });
	}

	const selectedOption = question.options.find(
		(opt) => opt.id === selectedOptionId,
	);
	if (!selectedOption) {
		return NextResponse.json({ error: "Invalid option" }, { status: 400 });
	}

	const attempt = await prisma.attempt.create({
		data: {
			userId: session.user.id,
			questionId,
			selectedOptionId,
			isCorrect: selectedOption.isCorrect,
			timeSpentSeconds: timeSpentSeconds || 0,
		},
	});

	await prisma.question.update({
		where: { id: questionId },
		data: { timesUsed: { increment: 1 } },
	});

	return NextResponse.json({
		attempt: {
			id: attempt.id,
			isCorrect: attempt.isCorrect,
		},
		correctOptionId: question.options.find((opt) => opt.isCorrect)?.id,
		rationale: selectedOption.rationale,
	});
}
