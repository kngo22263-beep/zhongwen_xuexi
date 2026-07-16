// Ghi nhan hoat dong hoc tap cua nguoi dung trong ngay
const KEY = 'zhongwen_study_sessions'
const EVAL_KEY = 'zhongwen_study_evaluations'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function readSessions() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}
function writeSessions(data) { localStorage.setItem(KEY, JSON.stringify(data)) }

function readEvals() {
  try { return JSON.parse(localStorage.getItem(EVAL_KEY)) || [] } catch { return [] }
}
function writeEvals(data) { localStorage.setItem(EVAL_KEY, JSON.stringify(data)) }

// Ghi nhan khi nguoi dung mo 1 bai hoc (bat dau hoc)
export function recordLessonOpen(lessonId, lessonName, wordCount) {
  const sessions = readSessions()
  const today = todayStr()
  const existing = sessions.find((s) => s.lesson_id === lessonId && s.date === today)
  if (existing) {
    existing.words_total = wordCount
    existing.last_active = new Date().toISOString()
  } else {
    sessions.push({
      id: 'ss' + Date.now(),
      lesson_id: lessonId,
      lesson_name: lessonName,
      date: today,
      words_total: wordCount,
      flashcards_viewed: 0,
      flashcards_known: 0,
      quiz_total: 0,
      quiz_correct: 0,
      quiz_types: [],
      started_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    })
  }
  writeSessions(sessions)
}

// Ghi nhan khi hoc flashcard
export function recordFlashcard(lessonId, viewed, known) {
  const sessions = readSessions()
  const today = todayStr()
  const s = sessions.find((x) => x.lesson_id === lessonId && x.date === today)
  if (s) {
    s.flashcards_viewed = viewed
    s.flashcards_known = known
    s.last_active = new Date().toISOString()
    writeSessions(sessions)
  }
}

// Ghi nhan khi lam bai kiem tra
export function recordQuizResult(lessonId, total, correct, quizType) {
  const sessions = readSessions()
  const today = todayStr()
  const s = sessions.find((x) => x.lesson_id === lessonId && x.date === today)
  if (s) {
    s.quiz_total = (s.quiz_total || 0) + total
    s.quiz_correct = (s.quiz_correct || 0) + correct
    if (quizType && !s.quiz_types.includes(quizType)) s.quiz_types.push(quizType)
    s.last_active = new Date().toISOString()
    writeSessions(sessions)
  }
}

// Lay tat ca hoat dong hoc trong ngay hom nay
export function getTodaySessions() {
  const today = todayStr()
  return readSessions().filter((s) => s.date === today)
}

// Lay tat ca hoat dong hoc (moi ngay)
export function getAllSessions() {
  return readSessions()
}

// Tinh thoi gian hoc (giay) - tu luc bat dau den luc cuoi cung
export function getTodayStudyTime() {
  const sessions = getTodaySessions()
  let totalSeconds = 0
  sessions.forEach((s) => {
    if (s.started_at && s.last_active) {
      const diff = (new Date(s.last_active) - new Date(s.started_at)) / 1000
      totalSeconds += Math.max(0, diff)
    }
  })
  return Math.round(totalSeconds)
}

// Luu ket qua danh gia cua AI
export function saveEvaluation(evaluation) {
  const evals = readEvals()
  const today = todayStr()
  const existing = evals.findIndex((e) => e.date === today)
  const entry = { ...evaluation, date: today, created_at: new Date().toISOString() }
  if (existing >= 0) {
    evals[existing] = entry
  } else {
    evals.push(entry)
  }
  writeEvals(evals)
}

// Lay lich su danh gia
export function getEvaluationHistory() {
  return readEvals().sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

// Lay danh gia cua ngay hom nay
export function getTodayEvaluation() {
  const today = todayStr()
  return readEvals().find((e) => e.date === today) || null
}