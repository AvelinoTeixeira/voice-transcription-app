'use client'

import { useEffect, useRef } from 'react'



interface WaveformVisualizerProps {
  isRecording: boolean
  isPaused: boolean
}

export function WaveformVisualizer({ isRecording, isPaused }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (isRecording && !isPaused) {
      startVisualizer()
    } else {
      stopVisualizer()
    }

    return () => stopVisualizer()
  }, [isRecording, isPaused])

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // AudioContext → motor de processamento de áudio do browser
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      // AnalyserNode → lê os dados de frequência do áudio em tempo real
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256  // quanto maior, mais detalhe (mas mais pesado)
      analyserRef.current = analyser

      // Liga o microfone ao analyser
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      sourceRef.current = source

      drawWaveform()
    } catch (err) {
      console.error('[WaveformVisualizer] Error:', err)
    }
  }

  const stopVisualizer = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    // Limpa o canvas quando para
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const drawWaveform = () => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Array que vai guardar os dados de amplitude do áudio
    const bufferLength = analyser.frequencyBinCount  // metade do fftSize = 128
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      // Preenche o dataArray com os dados de frequência atuais
      analyser.getByteFrequencyData(dataArray)

      // Limpa o frame anterior
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        // dataArray[i] vai de 0 a 255 (amplitude da frequência)
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8

        // Gradiente de cor: verde quando baixo, vermelho quando alto
        const hue = 120 - (dataArray[i] / 255) * 60  // 120=verde → 60=amarelo
        ctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.9)`

        // Desenha a barra centrada verticalmente
        ctx.fillRect(
          x,
          (canvas.height - barHeight) / 2,
          barWidth - 1,
          barHeight
        )

        x += barWidth
      }
    }

    draw()
  }

  // Estado idle → mostra linha estática no centro
  if (!isRecording) {
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <div className="w-full h-px bg-slate-200 dark:bg-slate-700" />
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={80}
      className="w-full h-20 rounded-lg bg-slate-950"
    />
  )
}