"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type OptionStatus = "idle" | "selected" | "correct" | "wrong" | "disabled";

interface OptionButtonProps {
	text: string;
	label: string;
	status: OptionStatus;
	onSelect: () => void;
}

const STATUS_STYLES: Record<OptionStatus, string> = {
	idle: "border-zinc-200 bg-white hover:border-emerald-400 hover:bg-emerald-50",
	selected: "border-emerald-500 bg-emerald-50",
	correct: "border-emerald-500 bg-emerald-50",
	wrong: "border-red-400 bg-red-50",
	disabled: "border-zinc-200 bg-zinc-50 opacity-60 cursor-not-allowed",
};

export function OptionButton({
	text,
	label,
	status,
	onSelect,
}: OptionButtonProps) {
	return (
		<button
			onClick={status === "disabled" ? undefined : onSelect}
			disabled={status === "disabled"}
			className={cn(
				"group relative flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
				STATUS_STYLES[status],
			)}
		>
			<span
				className={cn(
					"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
					status === "correct" && "bg-emerald-500 text-white",
					status === "wrong" && "bg-red-400 text-white",
					status === "selected" && "bg-emerald-500 text-white",
					status === "idle" &&
						"bg-zinc-100 text-zinc-600 group-hover:bg-emerald-100 group-hover:text-emerald-700",
					status === "disabled" && "bg-zinc-100 text-zinc-400",
				)}
			>
				{label}
			</span>

			<span
				className={cn(
					"pt-1.5 text-sm leading-5",
					status === "correct" && "text-emerald-800",
					status === "wrong" && "text-red-700",
					status === "disabled" && "text-zinc-400",
				)}
			>
				{text}
			</span>

			{status === "correct" && (
				<CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-emerald-500" />
			)}
			{status === "wrong" && (
				<XCircle className="absolute right-3 top-3 h-5 w-5 text-red-400" />
			)}
		</button>
	);
}
