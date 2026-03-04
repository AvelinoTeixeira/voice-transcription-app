import 'dotenv/config'
import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'

import prismaPlugin from '@/plugins/prisma'
import { transcribeRoute } from '@/routes/transcribe'
import { historyRoute } from '@/routes/history'

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
})

async function bootstrap() {
  await fastify.register(helmet, {
    crossOriginResourcePolicy: false,
  })

  await fastify.register(cors, {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://voice-transcription-app-wine.vercel.app',
    ],
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  })

  await fastify.register(multipart, {
    limits: {
      fileSize: 25 * 1024 * 1024,
    },
  })

  await fastify.register(prismaPlugin)
  await fastify.register(transcribeRoute)
  await fastify.register(historyRoute)

  fastify.get('/health', async () => ({ status: 'ok' }))

  const port = Number(process.env.PORT ?? 3001)
  await fastify.listen({ port, host: '0.0.0.0' })
}

bootstrap().catch((err) => {
  fastify.log.error(err)
  process.exit(1)
})