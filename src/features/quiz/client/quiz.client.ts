import type {
  FetchQuestionsParams,
  FetchQuestionsResponse,
  StatsData,
  SubmitAttemptResponse,
} from '@/features/quiz/types'

function buildSearchParams(
  params: Record<string, string | number | boolean | string[] | undefined>,
): URLSearchParams {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const v of value) {
        sp.append(key, v)
      }
    } else {
      sp.set(key, String(value))
    }
  }
  return sp
}

export async function fetchQuestions(
  params: FetchQuestionsParams,
): Promise<FetchQuestionsResponse> {
  const sp = buildSearchParams({
    types: params.types?.map((t) => t.toUpperCase()),
    type: params.type?.toUpperCase(),
    difficulties: params.difficulties?.map((d) => d.toUpperCase()),
    difficulty: params.difficulty?.toUpperCase(),
    limit: params.limit,
    balance: params.balance,
  })

  const res = await fetch(`/api/questions/random?${sp}`)
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? 'Không thể tải câu hỏi')
  }
  const json = await res.json()
  return json.data
}

export async function fetchWeightedQuestions(
  params: FetchQuestionsParams,
): Promise<FetchQuestionsResponse> {
  const sp = buildSearchParams({
    types: params.types?.map((t) => t.toUpperCase()),
    difficulties: params.difficulties?.map((d) => d.toUpperCase()),
    limit: params.limit,
  })

  const res = await fetch(`/api/questions/weighted?${sp}`)
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? 'Không thể tải câu hỏi')
  }
  const json = await res.json()
  return json.data
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
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? 'Không thể ghi nhận câu trả lời')
  }
  const json = await res.json()
  return json.data
}

export async function fetchStats(): Promise<StatsData> {
  const res = await fetch('/api/stats')
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? 'Không thể tải thống kê')
  }
  const json = await res.json()
  return json.data
}

export async function fetchSavedQuestionIds(): Promise<string[]> {
  const res = await fetch('/api/saved-questions')
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? 'Không thể tải câu hỏi đã lưu')
  }
  const json = await res.json()
  return json.data
}

export async function toggleSaveQuestion(questionId: string): Promise<{ saved: boolean }> {
  const res = await fetch('/api/saved-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? 'Không thể thay đổi trạng thái lưu')
  }
  const json = await res.json()
  return json.data
}
