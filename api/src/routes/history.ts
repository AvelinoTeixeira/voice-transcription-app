import type { FastifyInstance } from 'fastify'

export async function historyRoute(fastify: FastifyInstance) {
  fastify.get('/transcriptions', async (request, reply) => {
    const transcriptions = await fastify.prisma.transcription.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return reply.send(transcriptions)
  })

  fastify.patch('/transcriptions/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { title } = request.body as { title: string }
    if (!title?.trim()) {
      return reply.status(400).send({ error: 'Title is required' })
    }
    const transcription = await fastify.prisma.transcription.update({
      where: { id },
      data: { title },
    })
    return reply.send(transcription)
  })

  fastify.delete('/transcriptions/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    await fastify.prisma.transcription.delete({ where: { id } })
    return reply.status(204).send()
  })
}