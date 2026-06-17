"use client";

import { cn, QUESTION_TYPE_LABELS } from "@/lib/utils";
import { OptionButton } from "./OptionButton";

type Option = { id: string; text: string; order: number };
type Question = {
	id: string;
	questionText: string;
	type: string;
	hint?: string | null;
	options: Option[];
};

interface QuestionCardProps {
	question: Question;
	selectedOptionId: string | null;
	correctOptionId: string | null;
	onSelect: (optionId: string) => void;
}

export function QuestionCard({
	question,
	selectedOptionId,
	correctOptionId,
	onSelect,
}: QuestionCardProps) {
	const labels = ["A", "B", "C", "D"];
	const isAnswered = correctOptionId !== null;

	function getStatus(optId: string) {
		if (!isAnswered) {
			return selectedOptionId === optId
				? ("selected" as const)
				: ("idle" as const);
		}
		if (optId === correctOptionId) return "correct" as const;
		if (optId === selectedOptionId && optId !== correctOptionId)
			return "wrong" as const;
		return "disabled" as const;
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
					{QUESTION_TYPE_LABELS[question.type] ?? question.type}
				</span>
				<p className="text-lg leading-7 text-zinc-900">
					{question.questionText}
				</p>
			</div>

			<div className="space-y-3">
				{question.options.map((opt, idx) => (
					<OptionButton
						key={opt.id}
						text={opt.text}
						label={labels[idx] ?? String(idx)}
						status={getStatus(opt.id)}
						onSelect={() => onSelect(opt.id)}
					/>
				))}
			</div>

			{isAnswered && question.hint && (
				<div
					className={cn(
						"rounded-xl border p-4 text-sm",
						selectedOptionId === correctOptionId
							? "border-emerald-200 bg-emerald-50 text-emerald-700"
							: "border-red-200 bg-red-50 text-red-700",
					)}
				>
					<span className="font-medium">Hint: </span>
					{question.hint}
				</div>
			)}
		</div>
	);
}
