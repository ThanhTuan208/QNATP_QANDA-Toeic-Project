'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { fetchSavedQuestionIds, toggleSaveQuestion } from '@/features/quiz/client/quiz.client'

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
