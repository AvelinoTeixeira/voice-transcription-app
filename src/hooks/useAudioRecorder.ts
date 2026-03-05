import { useState, useRef, useCallback } from 'react'
import type { RecorderStatus } from '@/types'

interface UseAudioRecorderReturn {
  status: RecorderStatus
  duration: number
  audioBlob: Blob | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  resetRecorder: () => void
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

 
  const statusRef = useRef<RecorderStatus>('idle')

  const setStatusSynced = useCallback((s: RecorderStatus) => {
    statusRef.current = s
    setStatus(s)
  }, [])

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setStatusSynced('finished')
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(250)
      setStatusSynced('recording')
      startTimer()

    } catch (error) {
      console.error('[useAudioRecorder] Microphone access denied:', error)
      setStatusSynced('idle')
    }
  }, [startTimer, setStatusSynced])

  const stopRecording = useCallback(() => {
    const currentStatus = statusRef.current

    
    if (mediaRecorderRef.current &&
      (currentStatus === 'recording' || currentStatus === 'paused')) {

    
      if (currentStatus === 'paused') {
        mediaRecorderRef.current.resume()
      }

      mediaRecorderRef.current.stop()
      stopTimer()
    }
  }, [stopTimer])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && statusRef.current === 'recording') {
      mediaRecorderRef.current.pause()
      setStatusSynced('paused')
      stopTimer()
    }
  }, [stopTimer, setStatusSynced])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && statusRef.current === 'paused') {
      mediaRecorderRef.current.resume()
      setStatusSynced('recording')
      startTimer()
    }
  }, [startTimer, setStatusSynced])

  const resetRecorder = useCallback(() => {
    stopTimer()
    if (mediaRecorderRef.current &&
      (statusRef.current === 'recording' || statusRef.current === 'paused')) {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    mediaRecorderRef.current = null
    chunksRef.current = []
    streamRef.current = null
    setStatusSynced('idle')
    setDuration(0)
    setAudioBlob(null)
  }, [stopTimer, setStatusSynced])

  return {
    status,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecorder,
  }
}