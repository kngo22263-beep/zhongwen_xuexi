const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-flash-latest'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

export const isAiReady = Boolean(API_KEY)

// Cho doi 1 khoang thoi gian
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }

export async function askGemini(prompt, retries = 3) {
  if (!API_KEY) throw new Error('Chua co API key Gemini. Hay dien VITE_GEMINI_API_KEY vao file .env')

  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })

    if (response.ok) {
      const data = await response.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      if (!text) throw new Error('Gemini khong tra ve noi dung. Vui long thu lai.')
      return text.trim()
    }

    // Neu bi qua tai (503) hoac 429 -> doi roi thu lai
    if ((response.status === 503 || response.status === 429) && attempt < retries) {
      await sleep(2000 * attempt) // doi 2s, 4s, 6s...
      continue
    }

    const errText = await response.text()
    throw new Error(`Loi goi API Gemini (${response.status}): ${errText}`)
  }

  throw new Error('Gemini đang quá tải. Vui lòng thử lại sau ít phút.')
}