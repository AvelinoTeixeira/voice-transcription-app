import type { TranscribeResponse, AIAction, Language } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function transcribeAudioStream(
  audioBlob: Blob,
  language: Language,
  onStatus: (status: 'transcribing' | 'cleaning', raw?: string) => void,
  onToken: (token: string) => void,
  onDone: (result: TranscribeResponse) => void,
  onError: (error: string) => void
): Promise<void> {
  const formData = new FormData()
  formData.append('language', language)                  
  formData.append('audio', audioBlob, 'recording.webm') 

  let response: Response

  try {
    response = await fetch(`${API_URL}/transcribe`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    onError('Não foi possível conectar ao servidor.')
    return
  }

  if (!response.ok || !response.body) {
    onError('Transcription failed')
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const text = decoder.decode(value)
    const lines = text.split('\n')

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue

      try {
        const data = JSON.parse(line.slice(6))

        if (data.error) { onError(data.error); return }
        if (data.done) { onDone(data); return }
        if (data.status) { onStatus(data.status, data.raw); continue }
        if (data.token) { onToken(data.token) }

      } catch {
        
      }
    }
  }
}

export async function runAIAction(
  action: AIAction,
  text: string,
  language: Language,
  question?: string
): Promise<string> {
  const response = await fetch('/api/ai-actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, text, language, question }),
  })

  if (!response.ok) {
    throw new Error(`AI action failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.result
}