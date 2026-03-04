type Language = 'pt' | 'en'

export const buildCleanerPrompt = (rawText: string, language: Language) => `
You are a professional transcription editor.

TASK: Clean and format the following voice transcription.

RULES:
- Fix punctuation and capitalization
- Remove filler words (uh, um, like, então, tipo, né, sabe)
- Keep the original meaning 100% intact
- Do NOT add information that wasn't said
- Output language: ${language === 'pt' ? 'Brazilian Portuguese' : 'English'}

RAW TRANSCRIPTION:
"""
${rawText}
"""

Return ONLY the cleaned text, no explanations.
`

export const buildSummaryPrompt = (cleanText: string, language: Language) => `
You are an expert at summarizing spoken content.

TASK: Create a concise summary of this transcription.

FORMAT:
- 3 to 5 bullet points maximum
- Start each bullet with an action verb
- Language: ${language === 'pt' ? 'Brazilian Portuguese' : 'English'}

TRANSCRIPTION:
"""
${cleanText}
"""

Return ONLY the bullet points, no title or intro.
`

export const buildTranslationPrompt = (text: string, targetLang: Language) => `
Translate the following transcription to ${targetLang === 'pt' ? 'Brazilian Portuguese' : 'English'}.

RULES:
- Preserve the natural spoken tone
- Keep the same structure and meaning
- Do NOT add or remove information

TEXT:
"""
${text}
"""

Return ONLY the translation.
`

export const buildAskPrompt = (transcription: string, question: string, language: Language) => `
You are an assistant helping the user understand a voice transcription.

TRANSCRIPTION CONTEXT:
"""
${transcription}
"""

USER QUESTION: ${question}

Answer based ONLY on the transcription above.
Be concise and direct.
Answer in ${language === 'pt' ? 'Brazilian Portuguese' : 'English'}.
`