// Quan ly bai hoc & tu vung - luu tren trinh duyet, moi bai co tu rieng
const KEY = 'zhongwen_vocab_data'

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { lessons: [], words: [] } }
  catch { return { lessons: [], words: [] } }
}
function writeAll(d) { localStorage.setItem(KEY, JSON.stringify(d)) }
function uid() { return 'id' + Date.now() + Math.floor(Math.random() * 100000) }

export async function getLessons() {
  const d = readAll()
  return d.lessons
    .map((l) => ({ ...l, word_count: d.words.filter((w) => w.lesson_id === l.id).length }))
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
}
export async function getLesson(id) {
  return readAll().lessons.find((l) => l.id === id) || null
}
export async function createLesson({ name, description }) {
  const d = readAll()
  const lesson = { id: uid(), name, description: description || '', created_at: new Date().toISOString() }
  d.lessons.push(lesson)
  writeAll(d)
  return lesson
}
export async function deleteLesson(id) {
  const d = readAll()
  d.lessons = d.lessons.filter((l) => l.id !== id)
  d.words = d.words.filter((w) => w.lesson_id !== id)
  writeAll(d)
  return true
}
export async function getWords(lessonId) {
  return readAll().words
    .filter((w) => w.lesson_id === lessonId)
    .sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''))
}
export async function addWord(lessonId, w) {
  const d = readAll()
  d.words.push({ id: uid(), lesson_id: lessonId, hanzi: w.hanzi, word_type: w.word_type || '', pinyin: w.pinyin || '', meaning: w.meaning || '', example: w.example || '', hsk_level: w.hsk_level || '', created_at: new Date().toISOString() })
  writeAll(d)
  return true
}
export async function addWordsBulk(lessonId, words) {
  const d = readAll()
  words.forEach((w) => d.words.push({ id: uid(), lesson_id: lessonId, hanzi: w.hanzi, word_type: w.word_type || '', pinyin: w.pinyin || '', meaning: w.meaning || '', example: w.example || '', hsk_level: w.hsk_level || '', created_at: new Date().toISOString() }))
  writeAll(d)
  return true
}
export async function updateWord(id, w) {
  const d = readAll()
  const i = d.words.findIndex((x) => x.id === id)
  if (i !== -1) { d.words[i] = { ...d.words[i], hanzi: w.hanzi, word_type: w.word_type || '', pinyin: w.pinyin || '', meaning: w.meaning || '', example: w.example || '', hsk_level: w.hsk_level || '' }; writeAll(d) }
  return true
}
export async function deleteWord(id) {
  const d = readAll()
  d.words = d.words.filter((w) => w.id !== id)
  writeAll(d)
  return true
}