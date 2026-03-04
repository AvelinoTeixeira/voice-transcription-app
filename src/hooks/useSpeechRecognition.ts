import { useState, useRef, useCallback, useEffect } from 'react'
import type { Language } from '@/types'


interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance
    webkitSpeechRecognition: new () => SpeechRecognitionInstance
  }
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

interface UseSpeechRecognitionReturn {
  liveTranscript: string
  finalTranscript: string
  isListening: boolean
  isSupported: boolean
  startListening: (language: Language) => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [liveTranscript, setLiveTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  // useRef para guardar o estado de isListening sem problemas de closure
  // Por quê? Callbacks como onend "congelam" o valor do state no momento
  // em que são criados — o ref é mutável e sempre tem o valor atual
  const isListeningRef = useRef(false)

  // Verifica suporte após montar — evita hydration mismatch no Next.js
  // O servidor não tem window, então isSupported começa sempre false
  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    )
  }, [])

  // Cleanup ao desmontar o componente
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = useCallback((language: Language) => {
    if (!isSupported) return

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    // pt-BR → Português do Brasil | en-US → Inglês americano
    recognition.lang = language === 'pt' ? 'pt-BR' : 'en-US'

    // continuous → continua a ouvir em vez de parar após primeira frase
    recognition.continuous = true

    // interimResults → retorna texto parcial enquanto fala
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          final += transcript + ' '
        } else {
          interim += transcript
        }
      }

      setLiveTranscript(interim)

      if (final) {
        setFinalTranscript(prev => prev + final)
        setLiveTranscript('')
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[useSpeechRecognition] Error:', event.error)
      setIsListening(false)
      isListeningRef.current = false
    }

    recognition.onend = () => {
      // Usa o ref em vez do state — evita o problema de closure
      if (isListeningRef.current) {
        recognition.start()
      }
    }

    recognition.start()
    setIsListening(true)
    isListeningRef.current = true
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
    isListeningRef.current = false
    setLiveTranscript('')
  }, [])

  const resetTranscript = useCallback(() => {
    setLiveTranscript('')
    setFinalTranscript('')
  }, [])

  return {
    liveTranscript,
    finalTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}