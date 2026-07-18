// =========================================================
// Ket noi Groq API (thay Gemini - nhanh hon, free nhieu hon)
// =========================================================

const API_KEY = import.meta.env.VITE_AI_API_KEY
const MODEL = import.meta.env.VITE_AI_MODEL || 'llama-3.1-8b-instant'

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

export const isAiReady = Boolean(API_KEY)

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }

export async function askGemini(prompt, retries = 3) {
  if (!API_KEY) throw new Error('Chua co API key. Hay dien VITE_AI_API_KEY vao file .env')

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        })
      })

      if (response.ok) {
        const data = await response.json()
        const text = data?.choices?.[0]?.message?.content ?? ''
        if (!text) throw new Error('AI khong tra ve noi dung. Vui long thu lai.')
        return text.trim()
      }

      if ((response.status === 429 || response.status === 503) && attempt < retries) {
        await sleep(2000 * attempt)
        continue
      }

      const errText = await response.text()
      throw new Error(`Loi API (${response.status}): ${errText}`)
    } catch (err) {
      if (attempt === retries) throw err
      await sleep(2000)
    }
  }

  throw new Error('Khong goi duoc AI. Vui long thu lai sau.')
}