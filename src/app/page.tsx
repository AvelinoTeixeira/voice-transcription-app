'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { History } from 'lucide-react'
import { WaveformVisualizer } from '@/components/recorder/WaveformVisualizer'
import { RecorderControls } from '@/components/recorder/RecorderControls'
import { LiveTranscript } from '@/components/transcript/LiveTranscript'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { transcribeAudioStream } from '@/lib/api'
import type { Language, TranscribeResponse } from '@/types'

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('pt')
  const [result, setResult] = useState<TranscribeResponse | null>(null)
  const [streamingText, setStreamingText] = useState('')
  const [rawText, setRawText] = useState('')
  const [processingStatus, setProcessingStatus] = useState<'transcribing' | 'cleaning' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    status,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecorder,
  } = useAudioRecorder()

  const {
    liveTranscript,
    finalTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition()

  useEffect(() => {
    if (audioBlob && status === 'processing') {
      handleTranscription()
    }
  }, [audioBlob, status])

  const handleTranscription = async () => {
  try {
    setError(null)
    setStreamingText('')
    setRawText('')
    setProcessingStatus('transcribing')  // ← define logo no início

    await transcribeAudioStream(
      audioBlob!,
      language,
      (status, raw) => {
        setProcessingStatus(status)
        if (raw) setRawText(raw)
      },
      (token) => setStreamingText(prev => prev + token),
      (result) => {
        setResult(result)
        setStreamingText('')
        setRawText('')
        setProcessingStatus(null)  // ← limpa quando termina
      },
      (err) => {
        setError(err)
        setProcessingStatus(null)  // ← limpa em caso de erro
        resetRecorder()
      }
    )
  } catch (err) {
    setError('Erro ao transcrever o áudio. Tenta novamente.')
    setProcessingStatus(null)
    resetRecorder()
    console.error('[HomePage] Transcription error:', err)
  }
}

  const handleStart = async () => {
    setResult(null)
    setError(null)
    setStreamingText('')
    setRawText('')
    setProcessingStatus(null)
    resetTranscript()
    await startRecording()
    startListening(language)
  }

  const handleStop = () => {
    stopRecording()
    stopListening()
  }

  const handlePause = () => {
    pauseRecording()
    stopListening()
  }

  const handleResume = () => {
    resumeRecording()
    startListening(language)
  }

  const handleReset = () => {
    resetRecorder()
    stopListening()
    resetTranscript()
    setResult(null)
    setStreamingText('')
    setRawText('')
    setProcessingStatus(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Voice Transcription
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
              Grava a tua voz e obtém uma transcrição precisa com AI
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors shrink-0"
          >
            <History className="w-4 h-4" />
            Histórico
          </Link>
        </div>

        {/* Card principal */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 flex flex-col gap-6">

          <WaveformVisualizer
            isRecording={status === 'recording'}
            isPaused={status === 'paused'}
          />

          <LiveTranscript
            finalTranscript={finalTranscript}
            liveTranscript={liveTranscript}
            isListening={isListening}
            isSupported={isSupported}
          />

          <RecorderControls
            status={status}
            duration={duration}
            language={language}
            onLanguageChange={setLanguage}
            onStart={handleStart}
            onStop={handleStop}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
          />
        </div>

        {/* Erro */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Etapa 1 — Whisper a processar */}
        {processingStatus === 'transcribing' && (
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-900 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  A transcrever áudio...
                </p>
                <p className="text-xs text-slate-400">Whisper AI a processar</p>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 2 — GPT-4o a refinar */}
        {processingStatus !== null && !result && (
          <div className="rounded-2xl border border-green-200 dark:border-green-900 bg-white dark:bg-slate-900 shadow-sm p-6 flex flex-col gap-3">
            {rawText && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                <p className="text-xs text-slate-400 mb-1">Whisper (cru)</p>
                <p className="text-xs text-slate-500 leading-relaxed italic">{rawText}</p>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-slate-400">GPT-4o a refinar...</p>
              </div>
              {streamingText && (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {streamingText}
                  <span className="inline-block w-0.5 h-4 bg-slate-400 animate-pulse ml-0.5 align-middle" />
                </p>
              )}
            </div>
          </div>
        )}

        {/* Resultado final */}
        {result && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Transcrição Final
              </h2>
              <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                via Whisper + GPT-4o
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.clean}
              </p>
            </div>

            <div className="flex gap-3 text-xs text-slate-400">
              <span>🌍 {result.language === 'pt' ? 'Português' : 'English'}</span>
              <span>⏱️ {result.duration}s</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(result.clean)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline underline-offset-2 transition-colors"
              >
                Copiar texto
              </button>
              <Link
                href="/dashboard"
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline underline-offset-2 transition-colors"
              >
                Ver histórico
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}