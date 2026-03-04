import { NextRequest, NextResponse } from 'next/server'
import { callGPT4o } from '@/lib/openai'
import {
  buildCleanerPrompt,
  buildSummaryPrompt,
  buildTranslationPrompt,
  buildAskPrompt,
} from '@/lib/prompts'
import type { AIAction, Language } from '@/types'


export async function POST(req: NextRequest) {
  try {
    const { action, text, language, question } = await req.json() as {
      action: AIAction
      text: string
      language: Language
      question?: string
    }

  
    const promptMap: Record<AIAction, () => string> = {
      clean: () => buildCleanerPrompt(text, language),
      summarize: () => buildSummaryPrompt(text, language),
      translate: () => buildTranslationPrompt(text, language === 'pt' ? 'en' : 'pt'),
      ask: () => buildAskPrompt(text, question ?? '', language),
    }

    const prompt = promptMap[action]()
    const result = await callGPT4o(prompt)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('[AI Actions Error]', error)
    return NextResponse.json(
      { error: 'AI action failed' },
      { status: 500 }
    )
  }
}