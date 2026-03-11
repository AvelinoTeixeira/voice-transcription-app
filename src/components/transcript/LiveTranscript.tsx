'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'
import type { Language } from '@/types'

interface LiveTranscriptProps {
  finalTranscript: string
  liveTranscript: string
  isListening: boolean
  isSupported: boolean
  language: Language
}

export function LiveTranscript({
  finalTranscript,
  liveTranscript,
  isListening,
  isSupported,
  language,
}: LiveTranscriptProps) {
  const tx = t(language)
  // Auto-scroll para o fim quando o texto cresce
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [finalTranscript, liveTranscript])

  if (!isSupported) {
    return (
      <div className="w-full min-h-32 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-4">
        <p className="text-sm text-amber-700 dark:text-amber-400">
          {tx.live.noSupport}
        </p>
      </div>
    )
  }

  const isEmpty = !finalTranscript && !liveTranscript

  return (
    <div
      className={cn(
        'w-full min-h-32 max-h-48 overflow-y-auto rounded-lg border p-4 transition-colors',
        isListening
          ? 'border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/10'
          : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50'
      )}
    >
      {isEmpty && !isListening && (
        <p className="text-slate-400 text-sm italic">
          {tx.live.placeholder}
        </p>
      )}

      {isEmpty && isListening && (
        <p className="text-slate-400 text-sm italic animate-pulse">
          {tx.live.listening}
        </p>
      )}

      {/* Texto de frases já completas */}
      {finalTranscript && (
        <span className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {finalTranscript}
        </span>
      )}

      {/* Texto parcial — cor diferente para distinguir do final */}
      {liveTranscript && (
        <span className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed italic">
          {liveTranscript}
        </span>
      )}

      {/* Cursor piscando indica que está a ouvir */}
      {isListening && (
        <span className="inline-block w-0.5 h-4 bg-red-400 animate-pulse ml-0.5 align-middle" />
      )}

      <div ref={bottomRef} />
    </div>
  )
}