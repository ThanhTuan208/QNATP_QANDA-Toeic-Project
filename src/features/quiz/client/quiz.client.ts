import { VALID_QUIZ_TYPES } from '@/features/quiz/constants'
import type {
  FetchQuestionsParams,
  FetchQuestionsResponse,
  StatsData,
  SubmitAttemptResponse,
} from '@/features/quiz/types'

export async function fetchQuestions(
  params: FetchQuestionsParams,
): Promise<FetchQuestionsResponse> {
  const searchParams = new URLSearchParams()

  if (params.types && params.types.length > 0) {
    for (const t of params.types) {
      searchParams.append('types', t.toUpperCase())
    }
  } else if (params.type && VALID_QUIZ_TYPES.has(params.type)) {
    searchParams.set('type', params.type.toUpperCase())
  }

  if (params.difficulties && params.difficulties.length > 0) {
    for (const d of params.difficulties) {
      searchParams.append('difficulties', d.toUpperCase())
    }
  } else if (params.difficulty) {
    searchParams.set('difficulty', params.difficulty)
  }

  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.balance) searchParams.set('balance', 'true')

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

export async function fetchWeightedQuestions(
  params: FetchQuestionsParams,
): Promise<FetchQuestionsResponse> {
  const searchParams = new URLSearchParams()

  if (params.types && params.types.length > 0) {
    for (const t of params.types) {
      searchParams.append('types', t.toUpperCase())
    }
  }

  if (params.difficulties && params.difficulties.length > 0) {
    for (const d of params.difficulties) {
      searchParams.append('difficulties', d.toUpperCase())
    }
  }

  if (params.limit) searchParams.set('limit', String(params.limit))

  const res = await fetch(`/api/questions/weighted?${searchParams}`)
  if (!res.ok) throw new Error('Không thể tải câu hỏi')
  return res.json()
}

export async function fetchStats(): Promise<StatsData> {
  const res = await fetch('/api/stats')
  if (!res.ok) throw new Error('Không thể tải thống kê')
  const json = await res.json()
  return json.data
}
