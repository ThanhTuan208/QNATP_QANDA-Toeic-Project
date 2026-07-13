'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

async function fetchSavedQuestionIds(): Promise<string[]> {
  const res = await fetch('/api/saved-questions')
  if (!res.ok) throw new Error('Failed to fetch saved questions')
  const json = await res.json()
  return json.data ?? []
}

async function toggleSaveQuestion(questionId: string): Promise<{ saved: boolean }> {
  const res = await fetch('/api/saved-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId }),
  })
  if (!res.ok) throw new Error('Failed to toggle save')
  const json = await res.json()
  return json.data
}

export function useSavedQuestionIds() {
  return useQuery({
    queryKey: ['saved-questions'],
    queryFn: fetchSavedQuestionIds,
    staleTime: 30_000,
  })
}

export function useSaveQuestion(questionId: string) {
  const queryClient = useQueryClient()
  const { data: savedIds = [] } = useSavedQuestionIds()

  const mutation = useMutation({
    mutationFn: () => toggleSaveQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-questions'] })
    },
  })

  const isSaved = savedIds.includes(questionId)

  const toggle = useCallback(() => {
    mutation.mutate()
  }, [mutation.mutate])

  return { isSaved, toggle, loading: mutation.isPending }
}
