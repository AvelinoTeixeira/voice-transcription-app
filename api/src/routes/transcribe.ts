import type { FastifyInstance } from 'fastify'
import { WhisperService } from '@/services/whisper'
import { CleanerService } from '@/services/cleaner'
import type { Language } from '@/types'

export async function transcribeRoute(fastify: FastifyInstance) {
  fastify.post('/transcribe', async (request, reply) => {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ error: 'No audio file provided' })
    }

    const fields = data.fields as Record<string, { value: string }>
    const language: Language = (fields.language?.value ?? 'pt') as Language

    const chunks: Buffer[] = []
    for await (const chunk of data.file) {
      chunks.push(chunk)
    }
    const audioBuffer = Buffer.concat(chunks)
    const duration = Math.round(audioBuffer.length / 16000)

    try {
      const whisperService = new WhisperService()
      const cleanerService = new CleanerService()

      // 1. Whisper — transcrição crua
      fastify.log.info('Sending audio to Whisper...')
      const { text: rawText } = await whisperService.transcribe(audioBuffer, language)

      // 2. GPT-4o com streaming
      fastify.log.info('Streaming clean text with GPT-4o...')
      const stream = await cleanerService.cleanStream(rawText, language)

      // Configura headers para SSE
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      })

      let cleanText = ''

      // Envia cada chunk ao frontend assim que chega
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content ?? ''
        if (token) {
          cleanText += token
          // Formato SSE: "data: <conteúdo>\n\n"
          reply.raw.write(`data: ${JSON.stringify({ token })}\n\n`)
        }
      }

      // Salva no banco após streaming completo
      const transcription = await fastify.prisma.transcription.create({
        data: { rawText, cleanText, language, duration },
      })

      // Evento final com metadata
      reply.raw.write(`data: ${JSON.stringify({
        done: true,
        id: transcription.id,
        raw: rawText,
        clean: cleanText,
        language,
        duration,
      })}\n\n`)

      reply.raw.end()

    } catch (error) {
      fastify.log.error(error)
      reply.raw.write(`data: ${JSON.stringify({ error: 'Transcription failed' })}\n\n`)
      reply.raw.end()
    }
  })
}