import type { SessionQuestion } from '@/features/temp-session/types'

export interface GenerateRequest {
  parts: number[]
  knowledgeGroups: Record<number, { type: string; count: number }[]>
  difficulty: string[]
  totalQuestions: number
}

export interface GenerateResponse {
  questions: SessionQuestion[]
}

export async function generateSessionQuestions(config: GenerateRequest): Promise<GenerateResponse> {
  const res = await fetch('/api/sessions/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? 'Không thể sinh câu hỏi từ hệ thống')
  }
  const json = await res.json()
  return json.data
}
