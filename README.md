# 🎙️ Real-Time Voice → AI Pipeline

A production-grade system that transforms live audio into structured AI insights — in real-time. Engineered for low latency, high throughput, and scalability.

🔗 [Live Demo](https://voice-transcription-app-wine.vercel.app/) | 👨‍💻 [LinkedIn](https://www.linkedin.com/in/avelino-teixeira/)

---

## ⚡ Overview

🎙️ Capture → 🧾 Transcribe → 🤖 Contextualize → ⚡ Deliver

A real-time voice pipeline with near-zero perceived latency, streaming AI responses, and a decoupled architecture designed for production scale.

---

## 🏗️ Architecture

[ Browser ] ───▶ 🎙️ Audio Capture ───▶ 🧾 Transcription (Whisper)  
                                               │  
[ Dashboard ] ◀─── ⚡ Streaming (SSE) ◀─── 🤖 AI Processing (LLM)

---

## 🧠 Tech Stack

- **Frontend:** Next.js 15 + TypeScript (App Router)  
- **Backend:** Node.js (Fastify) for high-performance streaming  
- **Streaming:** Server-Sent Events (SSE) for token-by-token delivery  
- **AI Layer:** Whisper large-v3 + LLaMA 3.3 (70B) via Groq  
- **Database:** PostgreSQL + Prisma  

---

## 🚀 Key Features

- **Token-by-token AI streaming:** Real-time refinement using SSE  
- **Low-latency UX:** Continuous user feedback with zero blocking operations  
- **Scalable & Decoupled:** Frontend and Backend scale independently  
- **Performance-first:** Lighthouse score 95+ even under heavy AI workloads  

---

## 🛠️ Quick Start

```bash
# Clone the repository
git clone https://github.com/AvelinoTeixeira/voice-transcription-app/

# Install dependencies
npm install

# Run the development server
npm run dev
