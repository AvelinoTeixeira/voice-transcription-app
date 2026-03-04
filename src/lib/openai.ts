import OpenAI from 'openai'


export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
})

// Função helper para chamadas ao GPT-4o
export async function callGPT4o(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,  
    max_tokens: 1000,
  })

  return response.choices[0].message.content ?? ''
}