export type Language = 'pt' | 'en'

export type RecorderStatus =
  | 'idle'
  | 'recording'
  | 'paused'
  | 'processing'
  | 'finished'

export type AIAction = 'clean' | 'summarize' | 'translate' | 'ask'

export interface Transcription {
  id: string
  title: string | null  // ← adicionado
  rawText: string
  cleanText: string
  language: Language
  duration: number
  createdAt: string
}

export interface SpeechResult {
  transcript: string
  isFinal: boolean
  confidence: number
}

export interface AIActionResult {
  action: AIAction
  input: string
  output: string
  model: 'gpt-4o'
  tokensUsed?: number
}

export interface AIActionsState {
  isLoading: boolean
  currentAction: AIAction | null
  result: AIActionResult | null
  error: string | null
}

export interface TranscribeResponse {
  id: string            // ← adicionado
  raw: string
  clean: string
  language: Language
  duration: number
}