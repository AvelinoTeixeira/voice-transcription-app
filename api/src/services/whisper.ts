import Groq from 'groq-sdk'
import type { Language } from '@/types'

export class WhisperService {
  private client: Groq

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }

  async transcribe(
    audioBuffer: Buffer,
    language: Language
  ): Promise<{ text: string; detectedLanguage: string }> {

    const file = new File(
      [audioBuffer as unknown as BlobPart],
      'recording.webm',
      { type: 'audio/webm' }
    )

    const response = await this.client.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3',
      language: language === 'pt' ? 'pt' : 'en',
    })

    return {
      text: response.text,
      detectedLanguage: language,
    }
  }
}