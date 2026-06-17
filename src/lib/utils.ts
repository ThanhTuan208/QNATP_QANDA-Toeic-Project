import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const QUESTION_TYPE_LABELS: Record<string, string> = {
	WORD_FORM: "Word Form (Từ loại)",
	VOCABULARY: "Vocabulary & Collocation",
	VERB_TENSE: "Verb Tense (Thì)",
	PREPOSITION: "Prepositions (Giới từ)",
	CONJUNCTION: "Conjunctions (Liên từ)",
	PARTICIPLE: "Participles (Phân từ)",
	VOICE: "Passive Voice & Causative",
	RELATIVE_CLAUSE: "Relative Clauses",
	COMPARISON: "Comparisons (So sánh)",
	AGREEMENT: "Subject-Verb Agreement",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
	EASY: "Dễ",
	MEDIUM: "Trung bình",
	HARD: "Khó",
};

export function formatAccuracy(correct: number, total: number): string {
	if (total === 0) return "0%";
	return `${Math.round((correct / total) * 100)}%`;
}
