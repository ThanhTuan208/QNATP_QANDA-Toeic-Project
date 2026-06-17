"use client";

import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RationaleBoxProps {
	isCorrect: boolean;
	rationale: string;
	onNext: () => void;
	hasNext: boolean;
}

export function RationaleBox({
	isCorrect,
	rationale,
	onNext,
	hasNext,
}: RationaleBoxProps) {
	return (
		<div className="space-y-4">
			<div
				className={cn(
					"rounded-xl border-2 p-5",
					isCorrect
						? "border-emerald-200 bg-emerald-50"
						: "border-red-200 bg-red-50",
				)}
			>
				<div className="mb-3 flex items-center gap-2">
					{isCorrect ? (
						<>
							<CheckCircle2 className="h-6 w-6 text-emerald-500" />
							<span className="text-lg font-semibold text-emerald-700">
								Correct!
							</span>
						</>
					) : (
						<>
							<XCircle className="h-6 w-6 text-red-400" />
							<span className="text-lg font-semibold text-red-700">
								Incorrect
							</span>
						</>
					)}
				</div>
				<p
					className={cn(
						"text-sm leading-6",
						isCorrect ? "text-emerald-700" : "text-red-700",
					)}
				>
					{rationale}
				</p>
			</div>

			{hasNext && (
				<button
					onClick={onNext}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
				>
					Next Question
					<ArrowRight className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
