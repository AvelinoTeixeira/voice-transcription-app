import Groq from 'groq-sdk'
import { buildCleanerPrompt } from '@/lib/prompts'
import type { Language } from '@/types'

export class CleanerService {
  private client: Groq

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }

  async clean(rawText: string, language: Language): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: buildCleanerPrompt(rawText, language) }],
      temperature: 0.3,
      max_tokens: 1000,
    })

    return response.choices[0].message.content ?? rawText
  }

  async cleanStream(rawText: string, language: Language) {
    return this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: buildCleanerPrompt(rawText, language) }],
      temperature: 0.3,
      max_tokens: 1000,
      stream: true,
    })
  }
}