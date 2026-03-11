'use client'

import { Mic, Square, Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDuration } from '@/lib/utils'
import { t } from '@/lib/i18n'
import type { RecorderStatus, Language } from '@/types'

interface RecorderControlsProps {
  status: RecorderStatus
  duration: number
  language: Language
  transcription?: string   
  onLanguageChange: (lang: Language) => void
  onStart: () => void
  onStop: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
}

export function RecorderControls({
  status,
  duration,
  language,
  onLanguageChange,
  transcription, 
  onStart,
  onStop,
  onPause,
  onResume,
  onReset,
}: RecorderControlsProps) {
  const tx = t(language)
  const isIdle = status === 'idle'
  const isRecording = status === 'recording'
  const isPaused = status === 'paused'
  const isProcessing = status === 'processing'

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Seletor de idioma — só visível quando idle */}
      {isIdle && (
        <div className="flex gap-2">
          <button
            onClick={() => onLanguageChange('pt')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              language === 'pt'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            🇧🇷 Português
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              language === 'en'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            🇺🇸 English
          </button>
        </div>
      )}

      {/* Timer — só visível durante gravação */}
      {(isRecording || isPaused) && (
        <div className="flex items-center gap-2">
          {isRecording && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
            {formatDuration(duration)}
          </span>
          {isPaused && (
            <Badge variant="secondary">{tx.recorder.paused}</Badge>
          )}
        </div>
      )}

      {/* Botões de controlo */}
      <div className="flex items-center gap-3">

        {/* IDLE → botão de iniciar */}
        {isIdle && (
          <Button
            onClick={onStart}
            size="lg"
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-200 transition-all"
          >
            <Mic className="w-6 h-6" />
          </Button>
        )}

        {/* RECORDING → parar + pausar */}
        {isRecording && (
          <>
            <Button
              onClick={onPause}
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12"
            >
              <Pause className="w-5 h-5" />
            </Button>
            <Button
              onClick={onStop}
              size="lg"
              className="rounded-full w-16 h-16 bg-slate-900 hover:bg-slate-700 text-white shadow-lg"
            >
              <Square className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* PAUSED → retomar + parar */}
        {isPaused && (
          <>
            <Button
              onClick={onResume}
              size="lg"
              className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 text-white shadow-lg"
            >
              <Play className="w-6 h-6" />
            </Button>
            <Button
              onClick={onStop}
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12"
            >
              <Square className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* PROCESSING → spinner simples e neutro */}
        {isProcessing && !transcription &&  (
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            <span className="text-sm">{tx.recorder.processing}</span>
          </div>
        )}
      </div>

      {/* Botão reset */}
      {(isRecording || isPaused) && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          {tx.recorder.restart}
        </button>
      )}
    </div>
  )
}