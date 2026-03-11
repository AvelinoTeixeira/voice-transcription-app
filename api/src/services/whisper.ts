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
  ): Promise<{ text: string; detectedLanguage: Language }> {
    const blob = new Blob([new Uint8Array(audioBuffer)], {
      type: "audio/webm",
    });
    const file = new File([blob], "recording.webm", { type: "audio/webm" });

    const response = await this.client.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
    });

    const raw = (response.language ?? language).toLowerCase();
    const detectedLanguage: Language =
      raw.startsWith("en") ? "en" :
      raw.startsWith("pt") ? "pt" :
      language;

    return {
      text: response.text,
      detectedLanguage,
    };
  }
}