import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	const question = await prisma.question.findUnique({
		where: { id },
		include: {
			options: {
				orderBy: { order: "asc" },
				select: {
					id: true,
					text: true,
					order: true,
				},
			},
		},
	});

	if (!question) {
		return NextResponse.json({ error: "Question not found" }, { status: 404 });
	}

	return NextResponse.json({ question });
}
