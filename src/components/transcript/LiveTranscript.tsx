'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface LiveTranscriptProps {
  finalTranscript: string    // frases completas acumuladas
  liveTranscript: string     // texto parcial enquanto fala
  isListening: boolean
  isSupported: boolean
}

export function LiveTranscript({
  finalTranscript,
  liveTranscript,
  isListening,
  isSupported,
}: LiveTranscriptProps) {
  // Auto-scroll para o fim quando o texto cresce
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [finalTranscript, liveTranscript])

  // Browser não suporta Web Speech API (ex: Firefox)
  if (!isSupported) {
    return (
      <div className="w-full min-h-32 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-4">
        <p className="text-sm text-amber-700 dark:text-amber-400">
          ⚠️ O teu browser não suporta transcrição ao vivo.
          A transcrição final estará disponível após a gravação via Whisper.
          Para melhor experiência usa o Chrome.
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
          A transcrição aparecerá aqui enquanto falas...
        </p>
      )}

      {isEmpty && isListening && (
        <p className="text-slate-400 text-sm italic animate-pulse">
          A ouvir...
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