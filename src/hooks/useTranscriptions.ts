import { useState, useEffect, useCallback } from 'react'
import type { Transcription, Language } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'


export function useTranscriptions() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTranscriptions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/transcriptions`)
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setTranscriptions(data)
    } catch {
      setError('Erro ao carregar transcrições.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteTranscription = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/transcriptions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')

      // Remove da lista localmente — sem refetch desnecessário
      setTranscriptions(prev => prev.filter(t => t.id !== id))
    } catch {
      setError('Erro ao apagar transcrição.')
    }
  }, [])

  useEffect(() => {
    fetchTranscriptions()
  }, [fetchTranscriptions])

  return {
    transcriptions,
    isLoading,
    error,
    deleteTranscription,
    refetch: fetchTranscriptions,
  }
}