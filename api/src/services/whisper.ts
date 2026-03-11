import Groq from "groq-sdk";

type Language = "pt" | "en";

export class WhisperService {
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async transcribe(
    audioBuffer: Buffer,
    language: Language,
  ): Promise<{ text: string; detectedLanguage: string }> {
    const blob = new Blob([new Uint8Array(audioBuffer)], {
      type: "audio/webm",
    });
    const file = new File([blob], "recording.webm", { type: "audio/webm" });

    const response = await this.client.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
    });

    return {
      text: response.text,
      detectedLanguage: (response.language ?? language) as Language, 
    };
  }
}
