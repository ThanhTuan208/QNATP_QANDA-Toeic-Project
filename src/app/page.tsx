import { QuizEngine } from "@/components/QuizEngine";

export default function Home() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-10">
			<div className="mb-8 text-center">
				<h1 className="text-2xl font-bold text-zinc-900">TOEIC Reading</h1>
				<p className="mt-1 text-sm text-zinc-500">Part 5 & 6 Practice</p>
			</div>
			<QuizEngine />
		</div>
	);
}
	