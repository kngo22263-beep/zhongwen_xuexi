import { askGemini } from '../lib/aiClient.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function faceValue(w, f) {
  if (f === 'hanzi') return w.hanzi || ''
  if (f === 'pinyin') return w.pinyin || ''
  if (f === 'meaning') return w.meaning || ''
  return ''
}
function topicToFaces(topic) {
  const map = {
    'Tiếng Việt → Hán tự': { q: 'meaning', a: 'hanzi' },
    'Hán tự → Tiếng Việt': { q: 'hanzi', a: 'meaning' },
    'Pinyin → Hán tự': { q: 'pinyin', a: 'hanzi' },
    'Hán tự → Pinyin': { q: 'hanzi', a: 'pinyin' },
    'Tiếng Việt → Pinyin': { q: 'meaning', a: 'pinyin' },
    'Pinyin → Tiếng Việt': { q: 'pinyin', a: 'meaning' },
    'Hán tự → Nghĩa (Tiếng Việt)': { q: 'hanzi', a: 'meaning' }
  }
  return map[topic] || { q: 'hanzi', a: 'meaning' }
}

export function generateQuiz({ words, type, count, topic }) {
  const usable = words.filter((w) => w.hanzi && (w.meaning || w.pinyin))
  if (usable.length < 2) return []
  const picked = shuffle(usable).slice(0, Math.min(count, usable.length))
  const faces = topicToFaces(topic)

  if (type === 'multiple') {
    return picked.map((w) => {
      const correct = faceValue(w, faces.a)
      const wrongs = shuffle(usable.filter((x) => x !== w)).map((x) => faceValue(x, faces.a))
        .filter((v) => v && v !== correct).slice(0, 3)
      return { question: faceValue(w, faces.q), options: shuffle([correct, ...wrongs]), answer: correct }
    }).filter((q) => q.question && q.answer && q.options.length >= 2)
  }
  if (type === 'short') {
    return picked.map((w) => ({ question: faceValue(w, faces.q), answer: faceValue(w, faces.a) }))
      .filter((q) => q.question && q.answer)
  }
  return []
}

// ===== GHEP CAU (dung AI) =====
export async function generateMatchQuiz({ words, count, topic }) {
  const usable = words.filter((w) => w.hanzi && w.meaning)
  if (usable.length < 3) throw new Error('Cần ít nhất 3 từ vựng có nghĩa để tạo câu hỏi ghép câu.')

  const n = Math.min(count, 20)
  const picked = shuffle(usable).slice(0, Math.min(usable.length, 30))
  const vocabList = picked.map((w) => `${w.hanzi} (${w.pinyin || ''}) = ${w.meaning}`).join('; ')

  let prompt = ''
  if (topic === 'Chọn từ điền vào chỗ trống') {
    prompt = `Bạn là giáo viên tiếng Trung. Dùng các từ vựng: ${vocabList}.
Tạo ${n} câu hỏi ĐIỀN TỪ VÀO CHỖ TRỐNG. Mỗi câu: viết 1 câu tiếng Trung đúng ngữ pháp, thay 1 từ bằng "___". Cho 4 lựa chọn (Hán tự).
Tra ve DUY NHAT mot mang JSON, khong giai thich, khong backtick:
[{"question":"cau chi bang Han tu co ___","options":["Han tu A","Han tu B","Han tu C","Han tu D"],"answer":"Han tu dung","answerPinyin":"pinyin cua dap an","answerMeaning":"nghia tieng Viet cua dap an"}]`
  } else {
    prompt = `Bạn là giáo viên tiếng Trung. Dùng các từ vựng: ${vocabList}.
Tạo ${n} câu hỏi SẮP XẾP TỪ THÀNH CÂU. Mỗi câu: chọn 1 câu tiếng Trung đúng ngữ pháp (5-7 từ), tách thành các từ rời (CHI HAN TU, khong pinyin khong nghia), xao tron thu tu, noi bang " / ".
Tra ve DUY NHAT mot mang JSON, khong giai thich, khong backtick:
[{"question":"tu1 / tu2 / tu3 (chi Han tu, cach nhau boi / )","answer":"cau hoan chinh chi Han tu","answerPinyin":"pinyin cua ca cau","answerMeaning":"nghia tieng Viet cua ca cau"}]`
  }

  const raw = await askGemini(prompt)
  let cleaned = raw.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim()
  let arr = []
  try { arr = JSON.parse(cleaned) } catch { throw new Error('AI trả về không đúng định dạng. Vui lòng thử lại.') }
  if (!Array.isArray(arr) || arr.length === 0) throw new Error('AI không tạo được câu hỏi. Thử lại nhé.')

  return arr.filter((q) => q.question && q.answer).map((q) => ({
    question: String(q.question),
    answer: String(q.answer),
    answerPinyin: q.answerPinyin ? String(q.answerPinyin) : '',
    answerMeaning: q.answerMeaning ? String(q.answerMeaning) : '',
    options: Array.isArray(q.options) ? q.options.map(String) : undefined
  }))
}