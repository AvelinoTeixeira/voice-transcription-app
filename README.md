# 🎙️ Voice Transcription App

App full-stack de transcrição de voz com AI — grava, transcreve em tempo real e refina o texto com LLM.

---

## Stack

| | Tecnologia |
|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | Fastify + TypeScript |
| Database | PostgreSQL + Prisma |
| AI | Groq Whisper large-v3 + LLaMA 3.3 70B |

---

## Como funciona

```
Grava voz → Web Speech API mostra texto ao vivo
Para de gravar → Whisper transcreve com precisão
Whisper termina → LLaMA limpa o texto em streaming (SSE)
Resultado → guardado no PostgreSQL com título pesquisável
```

---

## Setup

```bash
# 1. Dependências
npm install && cd api && npm install

# 2. Base de dados
docker run -d --name voice_db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=voice_transcription \
  -p 5432:5432 postgres

# 3. Migrações
cd api && npx prisma migrate dev

# 4. Variáveis de ambiente
# api/.env → GROQ_API_KEY, DATABASE_URL, PORT=3001
# .env.local → NEXT_PUBLIC_API_URL=http://localhost:3001

# 5. Arrancar
cd api && npm run dev   # :3001
npm run dev             # :3000
```
