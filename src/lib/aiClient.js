const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash'

export const isAiReady = Boolean(API_KEY)

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }

export async function askGemini(prompt, retries = 3) {
  if (!API_KEY) throw new Error('Chua co API key Gemini. Hay dien VITE_GEMINI_API_KEY vao file .env')

  // Thu ca 2 cach goi API (key cu va key moi)
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
  ]

  for (let attempt = 1; attempt <= retries; attempt++) {
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        })

        if (response.ok) {
          const data = await response.json()
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
          if (!text) continue
          return text.trim()
        }

        if (response.status === 403 || response.status === 401) continue
        if (response.status === 503 || response.status === 429) { await sleep(2000 * attempt); continue }

        const errText = await response.text()
        throw new Error(`Loi API Gemini (${response.status}): ${errText}`)
      } catch (err) {
        if (err.message.startsWith('Loi API')) throw err
        continue
      }
    }
  }

  throw new Error('Không gọi được AI. Vui lòng kiểm tra API key hoặc thử lại sau.')
}