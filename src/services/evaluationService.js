import { askGemini } from '../lib/aiClient.js'
import { getTodaySessions, getTodayStudyTime, saveEvaluation } from './studyService.js'

/**
 * Goi AI danh gia hieu qua hoc tap trong ngay.
 * Tra ve ket qua danh gia va luu lai.
 */
export async function evaluateToday() {
  const sessions = getTodaySessions()
  if (!sessions || sessions.length === 0) {
    throw new Error('Hôm nay bạn chưa học bài nào. Hãy vào phần Từ vựng học ít nhất 1 bài trước khi đánh giá.')
  }

  // Tong hop du lieu hoc
  let totalWords = 0
  let totalFlashViewed = 0
  let totalFlashKnown = 0
  let totalQuiz = 0
  let totalCorrect = 0
  const lessonNames = []
  const quizTypes = []

  sessions.forEach((s) => {
    totalWords += s.words_total || 0
    totalFlashViewed += s.flashcards_viewed || 0
    totalFlashKnown += s.flashcards_known || 0
    totalQuiz += s.quiz_total || 0
    totalCorrect += s.quiz_correct || 0
    if (s.lesson_name) lessonNames.push(s.lesson_name)
    if (s.quiz_types) s.quiz_types.forEach((t) => { if (!quizTypes.includes(t)) quizTypes.push(t) })
  })

  const studyMinutes = Math.round(getTodayStudyTime() / 60)
  const accuracy = totalQuiz > 0 ? Math.round((totalCorrect / totalQuiz) * 100) : 0

  // Tao ban tom tat gui cho AI
  const summary = `
HOC TAP NGAY HOM NAY:
- So bai hoc da hoc: ${sessions.length} (${lessonNames.join(', ')})
- Tong so tu vung: ${totalWords}
- Flashcard da xem: ${totalFlashViewed}, da thuoc: ${totalFlashKnown}
- Kiem tra: ${totalQuiz} cau, dung ${totalCorrect} cau (ty le: ${accuracy}%)
- Cac dang kiem tra: ${quizTypes.length > 0 ? quizTypes.join(', ') : 'Chua lam kiem tra'}
- Thoi gian hoc khoang: ${studyMinutes} phut
`

  const prompt = `Ban la giao vien tieng Trung chuyen nghiep. Hay danh gia hieu qua hoc tap cua hoc vien dua tren du lieu sau:

${summary}

HAY TRA VE DUY NHAT mot JSON hop le (khong giai thich, khong backtick), gom:
{
  "score": so diem tu 0-100,
  "level": "Xuat sac" hoac "Tot" hoac "Kha" hoac "Can co gang",
  "summary": "nhan xet tong quat 2-3 cau bang tieng Viet",
  "strengths": ["diem manh 1", "diem manh 2"],
  "weaknesses": ["diem yeu 1", "diem yeu 2"],
  "weakWords": ["tu Han tu con yeu 1", "tu Han tu con yeu 2"],
  "recommendations": ["goi y 1 cho ngay mai", "goi y 2 cho ngay mai"]
}

Luu y:
- Neu chua lam kiem tra thi goi y nen lam kiem tra.
- Neu ty le dung thap thi chi ra can on lai nhung tu nao.
- Danh gia phai cu the, ca nhan hoa, khong chung chung.
- Diem score: 90-100 Xuat sac, 75-89 Tot, 60-74 Kha, duoi 60 Can co gang.`

  const raw = await askGemini(prompt)
  let cleaned = raw.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim()

  let result = null
  try {
    result = JSON.parse(cleaned)
  } catch {
    throw new Error('AI tra ve khong dung dinh dang. Vui long thu lai.')
  }

  // Ket hop du lieu hoc + ket qua AI
  const evaluation = {
    score: result.score || 0,
    level: result.level || 'Chua xac dinh',
    summary: result.summary || '',
    strengths: result.strengths || [],
    weaknesses: result.weaknesses || [],
    weakWords: result.weakWords || [],
    recommendations: result.recommendations || [],
    sessionsCount: sessions.length,
    totalWords,
    totalFlashViewed,
    totalFlashKnown,
    totalQuiz,
    totalCorrect,
    accuracy,
    studyMinutes,
    lessonNames
  }

  // Luu lai
  saveEvaluation(evaluation)

  return evaluation
}