import type {
  AttemptResult,
  FetchQuestionsParams,
  FetchQuestionsResponse,
  StatsData,
  SubmitAttemptResponse,
} from '@/features/quiz/types'

export async function fetchQuestions(
  params: FetchQuestionsParams,
): Promise<FetchQuestionsResponse> {
  const searchParams = new URLSearchParams()
  if (params.type) searchParams.set('type', params.type.toUpperCase())
  if (params.difficulty) searchParams.set('difficulty', params.difficulty)

  const res = await fetch(`/api/questions/random?${searchParams}`)
  if (!res.ok) throw new Error('Không thể tải câu hỏi')
  return res.json()
}

export async function submitAttempt(
  questionId: string,
  selectedOptionId: string,
): Promise<SubmitAttemptResponse> {
  const res = await fetch('/api/attempts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, selectedOptionId }),
  })
  if (!res.ok) throw new Error('Không thể ghi nhận câu trả lời')
  const json = await res.json()

  return json.data
}

export async function fetchStats(): Promise<StatsData> {
  const res = await fetch('/api/stats')
  if (!res.ok) throw new Error('Không thể tải thống kê')
  const json = await res.json()
  return json.data
}
