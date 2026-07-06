import { askGemini } from '../lib/aiClient.js'

/**
 * Tao doan van on tap bang AI Gemini.
 * @param {object} p
 * @param {string} p.vocab - tu vung nguoi dung nhap
 * @param {number} p.sentenceCount - so cau mong muon
 * @param {string} p.hskLevel - cap do HSK
 * @returns {Promise<{lines: Array<{hanzi, pinyin, meaning}>, level, count}>}
 */
export async function generateReviewPassage({ vocab, sentenceCount, hskLevel }) {
  const level = hskLevel || 'HSK1'
  const count = sentenceCount || 20

  // Loi yeu cau gui cho AI (prompt)
  const prompt = `Bạn là giáo viên tiếng Trung. Hãy viết MỘT đoạn văn tiếng Trung tự nhiên, mạch lạc, phù hợp trình độ ${level}.

YÊU CẦU:
- Đoạn văn có khoảng ${count} câu.
- Cố gắng sử dụng các từ vựng sau (nếu hợp lý): ${vocab}
- Nội dung dễ hiểu, đúng ngữ pháp, phù hợp người học ${level}.

ĐỊNH DẠNG TRẢ VỀ (RẤT QUAN TRỌNG):
- Trả về DUY NHẤT một mảng JSON hợp lệ, KHÔNG kèm giải thích, KHÔNG kèm dấu \`\`\`.
- Mỗi phần tử là một câu, gồm 3 trường:
  {"hanzi": "câu chữ Hán", "pinyin": "phiên âm pinyin có dấu", "meaning": "nghĩa tiếng Việt"}

VÍ DỤ:
[{"hanzi":"我是学生。","pinyin":"wǒ shì xué shēng.","meaning":"Tôi là học sinh."}]`

  const raw = await askGemini(prompt)

  // Xu ly ket qua -> cat bo dau ``` neu AI lo them vao
  let cleaned = raw.trim()
  cleaned = cleaned.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim()

  let lines = []
  try {
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed)) {
      lines = parsed
        .filter((item) => item && item.hanzi)
        .map((item) => ({
          hanzi: String(item.hanzi || '').trim(),
          pinyin: String(item.pinyin || '').trim(),
          meaning: String(item.meaning || '').trim()
        }))
    }
  } catch {
    // Neu AI khong tra ve JSON chuan -> tach theo tung dong lam phuong an du phong
    lines = cleaned
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ hanzi: s, pinyin: '', meaning: '' }))
  }

  if (lines.length === 0) {
    throw new Error('AI không tạo được đoạn văn hợp lệ. Vui lòng thử lại.')
  }

  return { lines, level, count }
}