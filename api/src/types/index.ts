export type Language = 'pt' | 'en'

export interface TranscribeResponse {
  id: string
  raw: string
  clean: string
  language: Language
  duration: number
}