import { useEffect, useState } from 'react'
import Loader from '../../components/Loader.jsx'
import { getSystemVocab, addSystemVocabBulk, deleteSystemVocab } from '../../services/ebookService.js'

/**
 * Tach text nhieu dong -> mang tu vung.
 * Moi dong: Han tu - Pinyin - Nghia - Loai tu - Cap do - Vi du
 * (Chi Han tu la bat buoc, cac phan sau tuy chon)
 */
function parseVocab(text) {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const p = line.split('-').map((x) => x.trim())
    return {
      hanzi: p[0] || '',
      pinyin: p[1] || '',
      meaning: p[2] || '',
      word_type: p[3] || '',
      hsk_level: p[4] || '',
      example: p[5] || ''
    }
  }).filter((w) => w.hanzi)
}

export default function ImportVocab() {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(null)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    try { setList(await getSystemVocab() || []) } catch { setList([]) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  function handlePreview() {
    setMsg('')
    const parsed = parseVocab(text)
    if (parsed.length === 0) { setMsg('Chưa có dữ liệu hợp lệ.'); return }
    setPreview(parsed)
  }

  async function handleImport() {
    setMsg('')
    const parsed = parseVocab(text)
    if (parsed.length === 0) { setMsg('Chưa có dữ liệu để nhập.'); return }
    setSaving(true)
    try {
      await addSystemVocabBulk(parsed)
      setMsg(`Đã nhập ${parsed.length} từ vào hệ thống!`)
      setText(''); setPreview(null); load()
    } catch (err) {
      setMsg('Lỗi: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">NHẬP DỮ LIỆU TỪ VỰNG</h1>
      <p className="text-sm text-gray-500 mb-5">
        Thêm từ vựng vào hệ thống (dùng cho người dùng và AI tạo câu hỏi / đoạn văn)
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Nhap lieu */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Nhập số lượng lớn</h2>
          <p className="text-sm text-gray-500">
            Mỗi dòng 1 từ theo định dạng:<br />
            <b>Hán tự - Pinyin - Nghĩa - Loại từ - Cấp độ - Ví dụ</b><br />
            <span className="text-xs text-gray-400">(Chỉ Hán tự bắt buộc, phần sau có thể để trống)</span>
          </p>

          <textarea value={text} onChange={(e) => { setText(e.target.value); setPreview(null) }}
            rows={8}
            placeholder={'学习 - xuéxí - học tập - Động từ - HSK1 - 我每天学习中文。\n你好 - nǐ hǎo - xin chào - - HSK1 -'}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none resize-none hanzi" />

          {msg && <div className="text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2">{msg}</div>}

          <div className="flex justify-end gap-3">
            <button onClick={handlePreview}
              className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold">👁 Xem trước</button>
            <button onClick={handleImport} disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold disabled:opacity-60">
              {saving ? 'Đang nhập...' : 'Nhập dữ liệu'}
            </button>
          </div>

          {preview && (
            <div className="border border-brand-100 rounded-xl overflow-hidden">
              <div className="bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">Xem trước ({preview.length} từ)</div>
              <div className="max-h-48 overflow-auto divide-y divide-gray-100">
                {preview.map((w, i) => (
                  <div key={i} className="px-3 py-2 text-sm flex gap-2">
                    <span className="hanzi font-semibold w-16">{w.hanzi}</span>
                    <span className="text-brand-600 italic w-24">{w.pinyin}</span>
                    <span className="text-gray-600 flex-1">{w.meaning}</span>
                    <span className="text-gray-400 text-xs">{w.hsk_level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Danh sach tu he thong */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Từ vựng hệ thống ({list.length})</h2>
          {loading ? <Loader text="Đang tải..." /> : list.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Chưa có từ vựng hệ thống.</p>
          ) : (
            <div className="space-y-1 max-h-[520px] overflow-auto">
              {list.map((w) => (
                <div key={w.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-50/40 text-sm">
                  <span className="hanzi font-semibold w-14">{w.hanzi}</span>
                  <span className="text-brand-600 italic w-20">{w.pinyin}</span>
                  <span className="text-gray-600 flex-1 truncate">{w.meaning}</span>
                  <span className="text-xs text-gray-400">{w.hsk_level}</span>
                  <button onClick={async () => {
                    if (window.confirm('Xóa từ này?')) { await deleteSystemVocab(w.id); load() }
                  }} className="text-gray-300 hover:text-red-500">🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}