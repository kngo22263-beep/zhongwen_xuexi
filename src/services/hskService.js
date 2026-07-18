// =========================================================
// Quan ly du lieu Hoc HSK - luu tren localStorage
// Giao trinh > Cap do > Bai hoc > (Tu vung, Bai khoa, Ngu phap)
// =========================================================

const KEY = 'zhongwen_hsk_data'

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { courses: [] } }
  catch { return { courses: [] } }
}
function writeAll(d) { localStorage.setItem(KEY, JSON.stringify(d)) }
function uid() { return 'hsk' + Date.now() + Math.floor(Math.random() * 100000) }

// ================== GIAO TRINH ==================

export function getCourses() {
  return readAll().courses || []
}

export function getCourse(courseId) {
  return readAll().courses.find((c) => c.id === courseId) || null
}

export function createCourse({ name, author, description }) {
  const d = readAll()
  const course = {
    id: uid(), name, author: author || '', description: description || '',
    levels: [], created_at: new Date().toISOString()
  }
  d.courses.push(course)
  writeAll(d)
  return course
}

export function deleteCourse(courseId) {
  const d = readAll()
  d.courses = d.courses.filter((c) => c.id !== courseId)
  writeAll(d)
}

// ================== CAP DO (trong giao trinh) ==================

export function getLevels(courseId) {
  const course = getCourse(courseId)
  return course?.levels || []
}

export function getLevel(courseId, levelId) {
  const course = getCourse(courseId)
  return course?.levels?.find((l) => l.id === levelId) || null
}

export function createLevel(courseId, { name, levelNum }) {
  const d = readAll()
  const course = d.courses.find((c) => c.id === courseId)
  if (!course) return null
  const level = {
    id: uid(), name: name || `HSK ${levelNum}`, levelNum: levelNum || 1,
    lessons: [], created_at: new Date().toISOString()
  }
  course.levels.push(level)
  writeAll(d)
  return level
}

export function deleteLevel(courseId, levelId) {
  const d = readAll()
  const course = d.courses.find((c) => c.id === courseId)
  if (course) { course.levels = course.levels.filter((l) => l.id !== levelId); writeAll(d) }
}

// ================== BAI HOC (trong cap do) ==================

export function getLessons(courseId, levelId) {
  const level = getLevel(courseId, levelId)
  return level?.lessons || []
}

export function getHskLesson(courseId, levelId, lessonId) {
  const level = getLevel(courseId, levelId)
  return level?.lessons?.find((l) => l.id === lessonId) || null
}

export function createHskLesson(courseId, levelId, { lessonNum, title, titleVi }) {
  const d = readAll()
  const course = d.courses.find((c) => c.id === courseId)
  const level = course?.levels?.find((l) => l.id === levelId)
  if (!level) return null
  const lesson = {
    id: uid(),
    lessonNum: lessonNum || level.lessons.length + 1,
    title: title || '', titleVi: titleVi || '',
    vocab: [], texts: [], grammar: [],
    completed: false,
    created_at: new Date().toISOString()
  }
  level.lessons.push(lesson)
  writeAll(d)
  return lesson
}

export function deleteHskLesson(courseId, levelId, lessonId) {
  const d = readAll()
  const course = d.courses.find((c) => c.id === courseId)
  const level = course?.levels?.find((l) => l.id === levelId)
  if (level) { level.lessons = level.lessons.filter((l) => l.id !== lessonId); writeAll(d) }
}

export function toggleLessonComplete(courseId, levelId, lessonId) {
  const d = readAll()
  const course = d.courses.find((c) => c.id === courseId)
  const level = course?.levels?.find((l) => l.id === levelId)
  const lesson = level?.lessons?.find((l) => l.id === lessonId)
  if (lesson) { lesson.completed = !lesson.completed; writeAll(d) }
}

// ================== TU VUNG (trong bai hoc) ==================

export function getHskVocab(courseId, levelId, lessonId) {
  const lesson = getHskLesson(courseId, levelId, lessonId)
  return lesson?.vocab || []
}

export function addHskVocab(courseId, levelId, lessonId, word) {
  const d = readAll()
  const lesson = findLesson(d, courseId, levelId, lessonId)
  if (!lesson) return
  lesson.vocab.push({
    id: uid(), hanzi: word.hanzi, pinyin: word.pinyin || '',
    word_type: word.word_type || '', meaning: word.meaning || '',
    example: word.example || ''
  })
  writeAll(d)
}

export function addHskVocabBulk(courseId, levelId, lessonId, words) {
  const d = readAll()
  const lesson = findLesson(d, courseId, levelId, lessonId)
  if (!lesson) return
  words.forEach((w) => {
    lesson.vocab.push({
      id: uid(), hanzi: w.hanzi, pinyin: w.pinyin || '',
      word_type: w.word_type || '', meaning: w.meaning || '',
      example: w.example || ''
    })
  })
  writeAll(d)
}

export function deleteHskVocab(courseId, levelId, lessonId, vocabId) {
  const d = readAll()
  const lesson = findLesson(d, courseId, levelId, lessonId)
  if (lesson) { lesson.vocab = lesson.vocab.filter((v) => v.id !== vocabId); writeAll(d) }
}

// ================== BAI KHOA (trong bai hoc) ==================

export function getHskTexts(courseId, levelId, lessonId) {
  const lesson = getHskLesson(courseId, levelId, lessonId)
  return lesson?.texts || []
}

export function addHskText(courseId, levelId, lessonId, text) {
  const d = readAll()
  const lesson = findLesson(d, courseId, levelId, lessonId)
  if (!lesson) return
  lesson.texts.push({
    id: uid(), title: text.title || '', content: text.content || '',
    pinyin: text.pinyin || '', translation: text.translation || ''
  })
  writeAll(d)
}

export function updateHskText(courseId, levelId, lessonId, textId, text) {
  const d = readAll()
  const lesson = findLesson(d, courseId, levelId, lessonId)
  if (!lesson) return
  const idx = lesson.texts.findIndex((t) => t.id === textId)
  if (idx !== -1) { lesson.texts[idx] = { ...lesson.texts[idx], ...text }; writeAll(d) }
}

export function deleteHskText(courseId, levelId, lessonId, textId) {
  const d = readAll()
  const lesson = findLesson(d, courseId, levelId, lessonId)
  if (lesson) { lesson.texts = lesson.texts.filter((t) => t.id !== textId); writeAll(d) }
}

// ================== NGU PHAP (trong bai hoc) ==================

export function getHskGrammar(courseId, levelId, lessonId) {
  const lesson = getHskLesson(courseId, levelId, lessonId)
  return lesson?.grammar || []
}

export function addHskGrammar(courseId, levelId, lessonId, grammar) {
  const d = readAll()
  const lesson = findLesson(d, courseId, levelId, lessonId)
  if (!lesson) return
  lesson.grammar.push({
    id: uid(), title: grammar.title || '', content: grammar.content || '',
    examples: grammar.examples || ''
  })
  writeAll(d)
}

export function deleteHskGrammar(courseId, levelId, lessonId, grammarId) {
  const d = readAll()
  const lesson = findLesson(d, courseId, levelId, lessonId)
  if (lesson) { lesson.grammar = lesson.grammar.filter((g) => g.id !== grammarId); writeAll(d) }
}

// ================== HELPER ==================

function findLesson(d, courseId, levelId, lessonId) {
  const course = d.courses.find((c) => c.id === courseId)
  const level = course?.levels?.find((l) => l.id === levelId)
  return level?.lessons?.find((l) => l.id === lessonId) || null
}