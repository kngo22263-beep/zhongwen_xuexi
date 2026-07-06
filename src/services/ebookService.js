import { supabase, isSupabaseReady } from '../lib/supabaseClient.js'

function needSupabase() {
  throw new Error(
    'Chức năng này cần Supabase. Hãy điền thông tin Supabase vào file .env rồi tải lại trang.'
  )
}

// ===================== EBOOK =====================

/** Lay danh sach ebook */
export async function getEbooks() {
  if (!isSupabaseReady) return []
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return data || []
}

/** Them ebook moi */
export async function createEbook({ title, hskLevel, course, author, description, fileUrl, isPublic }) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('ebooks').insert({
    title,
    hsk_level: hskLevel,
    course: course || 'HSK2.0',
    author: author || null,
    description: description || null,
    file_url: fileUrl || null,
    is_public: isPublic !== false
  })
  if (error) throw new Error(error.message)
  return true
}

/** Xoa ebook */
export async function deleteEbook(id) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('ebooks').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

// ============== TU VUNG HE THONG ==============

/** Lay tu vung he thong */
export async function getSystemVocab() {
  if (!isSupabaseReady) return []
  const { data, error } = await supabase
    .from('system_vocab')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

/** Them nhieu tu vung he thong cung luc */
export async function addSystemVocabBulk(words) {
  if (!isSupabaseReady) needSupabase()
  const rows = words.map((w) => ({
    hanzi: w.hanzi,
    pinyin: w.pinyin || null,
    meaning: w.meaning || null,
    word_type: w.word_type || null,
    hsk_level: w.hsk_level || null,
    example: w.example || null
  }))
  const { error } = await supabase.from('system_vocab').insert(rows)
  if (error) throw new Error(error.message)
  return true
}

/** Xoa 1 tu vung he thong */
export async function deleteSystemVocab(id) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('system_vocab').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

// ================== BAI DOC ==================

/** Lay danh sach bai doc */
export async function getReadings() {
  if (!isSupabaseReady) return []
  const { data, error } = await supabase
    .from('reading_passages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

/** Them bai doc moi */
export async function createReading({ title, hskLevel, topic, source, content, note }) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('reading_passages').insert({
    title,
    hsk_level: hskLevel,
    topic: topic || null,
    source: source || null,
    content,
    note: note || null
  })
  if (error) throw new Error(error.message)
  return true
}

/** Xoa bai doc */
export async function deleteReading(id) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('reading_passages').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return true
}