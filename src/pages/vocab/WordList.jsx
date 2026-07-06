import { useState } from 'react'
import { addWord, updateWord, deleteWord } from '../../services/vocabService.js'
import { WORD_TYPES } from '../../utils/constants.js'

const EMPTY = { hanzi: '', word_type: '', pinyin: '', meaning: '', example: '', hsk_level: '' }

// Doc phat am chu Han bang giong Trung Quoc
function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 0.9
  window.speechSynthesis.speak(u)
}

export default function WordList({ lessonId, words, onReload, onOpenBulk }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [adding, setAdding] = useState(false)

  let list = words.filter((w) => {
    const key = search.trim().toLowerCase()
    if (!key) return true
    return (
      w.hanzi?.toLowerCase().includes(key) ||
      w.pinyin?.toLowerCase().includes(key) ||
      w.meaning?.toLowerCase().includes(key)
    )
  })
  if (sort === 'az') list = [...list].sort((a, b) => (a.hanzi || '').localeCompare(b.hanzi || ''))

  function startEdit(w) {
    setEditingId(w.id)
    setForm({
      hanzi: w.hanzi || '', word_type: w.word_type || '', pinyin: w.pinyin || '',
      meaning: w.meaning || '', example: w.example || '', hsk_level: w.hsk_level || ''
    })
  }

  async function saveEdit() {
    if (!form.hanzi.trim()) return alert('Vui lòng nhập Hán tự.')
    await updateWord(editingId, form)
    setEditingId(null)
    onReload?.()
  }

  async function saveNew() {
    if (!form.hanzi.trim()) return alert('Vui lòng nhập Hán tự.')
    await addWord(lessonId, form)
    setForm(EMPTY)
    setAdding(false)
    onReload?.()
  }

  async function removeWord(id) {
    if (!window.confirm('Xóa từ vựng này?')) return
    await deleteWord(id)
    onReload?.()
  }

  function FormRow({ onSave, onCancel }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-brand-50 rounded-xl">
        <input value={form.hanzi} onChange={(e) => setForm({ ...form, hanzi: e.target.value })}
          placeholder="Hán tự" className="px-2 py-1.5 rounded border border-gray-200 hanzi" />
        <select value={form.word_type} onChange={(e) => setForm({ ...form, word_type: e.target.value })}
          className="px-2 py-1.5 rounded border border-gray-200">
          <option value="">Loại từ</option>
          {WORD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input value={form.pinyin} onChange={(e) => setForm({ ...form, pinyin: e.target.value })}
          placeholder="Pinyin" className="px-2 py-1.5 rounded border border-gray-200" />
        <input value={form.meaning} onChange={(e) => setForm({ ...form, meaning: e.target.value })}
          placeholder="Nghĩa" className="px-2 py-1.5 rounded border border-gray-200" />
        <input value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })}
          placeholder="Ví dụ" className="px-2 py-1.5 rounded border border-gray-200" />
        <div className="flex gap-1">
          <button onClick={onSave} className="flex-1 px-2 py-1.5 rounded bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold">Lưu</button>
          <button onClick={onCancel} className="px-2 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-sm">Hủy</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Tìm kiếm từ vựng..."
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm">
          <option value="default">Sắp xếp: Mặc định</option>
          <option value="az">Sắp xếp: A → Z</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button onClick={() => { setAdding(true); setForm(EMPTY) }}
            className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold">
            + Thêm từ vựng
          </button>
          <button onClick={onOpenBulk}
            className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold">
            📥 Nhập nhiều từ
          </button>
        </div>
        <span className="text-sm text-gray-400">{list.length} từ</span>
      </div>

      {adding && <div className="mb-3"><FormRow onSave={saveNew} onCancel={() => setAdding(false)} /></div>}

      {list.length === 0 && !adding ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-brand-100">
          <div className="text-5xl mb-3">📖</div>
          <p className="text-gray-500">Chưa có từ vựng. Nhấn <b>"+ Thêm từ vựng"</b> để bắt đầu!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((w) =>
            editingId === w.id ? (
              <FormRow key={w.id} onSave={saveEdit} onCancel={() => setEditingId(null)} />
            ) : (
              <div key={w.id} className="bg-white rounded-xl px-5 py-4 shadow-soft border border-brand-100 flex items-center gap-4">
                <div className="hanzi text-3xl font-bold text-gray-800 w-20">{w.hanzi}</div>
                <div className="flex-1">
                  <div className="text-purple-600 font-semibold text-sm">{w.pinyin || '—'}</div>
                  <div className="text-gray-700">{w.meaning || '—'}</div>
                  {w.example && <div className="hanzi text-xs text-gray-400 mt-1">{w.example}</div>}
                </div>
                <button onClick={() => speak(w.hanzi)} className="text-gray-400 hover:text-brand-500 text-xl" title="Đọc phát âm">🔊</button>
                <button onClick={() => startEdit(w)} className="text-brand-500 hover:text-brand-600 text-lg" title="Sửa">✏️</button>
                <button onClick={() => removeWord(w.id)} className="text-gray-300 hover:text-red-500" title="Xóa">🗑️</button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
