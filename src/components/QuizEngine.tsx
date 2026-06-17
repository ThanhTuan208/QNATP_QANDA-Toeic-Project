"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { RationaleBox } from "./RationaleBox";

type Question = {
	id: string;
	questionText: string;
	type: string;
	hint: string | null;
	options: { id: string; text: string; order: number }[];
};

type AttemptResult = {
	isCorrect: boolean;
	correctOptionId: string;
	rationale: string;
};

interface QuizEngineProps {
	type?: string;
	difficulty?: string;
}

export function QuizEngine({ type, difficulty }: QuizEngineProps) {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentIdx, setCurrentIdx] = useState(0);
	const [loading, setLoading] = useState(true);
	const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [result, setResult] = useState<AttemptResult | null>(null);

	useEffect(() => {
		const params = new URLSearchParams();
		if (type) params.set("type", type);
		if (difficulty) params.set("difficulty", difficulty);

		fetch(`/api/questions?${params}`)
			.then((r) => r.json())
			.then((data) => {
				setQuestions(data.questions);
				setLoading(false);
			});
	}, [type, difficulty]);

	const currentQuestion = questions[currentIdx];

	const handleSelect = useCallback(
		async (optionId: string) => {
			if (!currentQuestion || submitting || result) return;
			setSelectedOptionId(optionId);
			setSubmitting(true);

			try {
				const res = await fetch("/api/attempts", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						questionId: currentQuestion.id,
						selectedOptionId: optionId,
					}),
				});

				if (!res.ok) {
					setSelectedOptionId(null);
					return;
				}

				const data: AttemptResult & { attempt: { id: string } } =
					await res.json();
				setResult({
					isCorrect: data.isCorrect,
					correctOptionId: data.correctOptionId,
					rationale: data.rationale,
				});
			} finally {
				setSubmitting(false);
			}
		},
		[currentQuestion, submitting, result],
	);

	const handleNext = useCallback(() => {
		setSelectedOptionId(null);
		setResult(null);
		setCurrentIdx((i) => i + 1);
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
			</div>
		);
	}

	if (questions.length === 0) {
		return (
			<div className="py-20 text-center text-zinc-500">No questions found.</div>
		);
	}

	if (currentIdx >= questions.length) {
		return (
			<div className="space-y-4 py-10 text-center">
				<p className="text-lg font-semibold text-zinc-900">Quiz Complete!</p>
				<p className="text-zinc-500">
					You answered all {questions.length} questions.
				</p>
				<button
					onClick={() => {
						setCurrentIdx(0);
						setSelectedOptionId(null);
						setResult(null);
					}}
					className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
				>
					Start Over
				</button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-2xl space-y-6 py-8">
			<div className="flex items-center justify-between text-sm text-zinc-500">
				<span>
					Question {currentIdx + 1} of {questions.length}
				</span>
				{submitting && (
					<span className="flex items-center gap-1 text-emerald-600">
						<Loader2 className="h-3 w-3 animate-spin" />
						Checking...
					</span>
				)}
			</div>

			<QuestionCard
				key={currentQuestion.id}
				question={currentQuestion}
				selectedOptionId={selectedOptionId}
				correctOptionId={result?.correctOptionId ?? null}
				onSelect={handleSelect}
			/>

			{result && (
				<RationaleBox
					isCorrect={result.isCorrect}
					rationale={result.rationale}
					onNext={handleNext}
					hasNext={currentIdx < questions.length - 1}
				/>
			)}
		</div>
	);
}
