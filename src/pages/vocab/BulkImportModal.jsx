import { useState } from 'react'
import Modal from '../../components/Modal.jsx'
import { addWordsBulk } from '../../services/vocabService.js'

/**
 * Chuyen text nhieu dong thanh mang tu vung.
 * Moi dong: Han tu - Pinyin - Nghia
 */
function parseLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('-').map((p) => p.trim())
      return {
        hanzi: parts[0] || '',
        pinyin: parts[1] || '',
        meaning: parts[2] || ''
      }
    })
    .filter((w) => w.hanzi)
}

export default function BulkImportModal({ lessonId, onClose, onImported }) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handlePreview() {
    setError('')
    const parsed = parseLines(text)
    if (parsed.length === 0) {
      setError('Chưa có từ vựng hợp lệ. Mỗi dòng theo dạng: Hán tự - Pinyin - Nghĩa')
      return
    }
    setPreview(parsed)
  }

  async function handleImportAll() {
    setError('')
    const parsed = parseLines(text)
    if (parsed.length === 0) {
      setError('Chưa có từ vựng hợp lệ để nhập.')
      return
    }
    setLoading(true)
    try {
      await addWordsBulk(lessonId, parsed)
      onImported?.()
    } catch (err) {
      setError(err.message || 'Không nhập được từ vựng.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={true} onClose={onClose} maxWidth="max-w-2xl">
      {/* Tieu de */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">📥</span>
        <h3 className="text-2xl font-extrabold text-gray-800">Nhập nhiều từ vựng</h3>
      </div>
      <p className="text-sm text-gray-500">
        Mỗi dòng 1 từ theo định dạng: <b>Hán tự - Pinyin - Nghĩa</b>
      </p>
      <p className="text-sm text-gray-400 mb-3">
        VD: <span className="hanzi bg-gray-100 px-2 py-0.5 rounded">你好 - nǐ hǎo - Xin chào</span>
      </p>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setPreview(null)
        }}
        rows={7}
        placeholder={'你好 - nǐ hǎo - Xin chào\n谢谢 - xiè xiè - Cảm ơn\n再见 - zài jiàn - Tạm biệt'}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none resize-none hanzi"
      />

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Xem truoc */}
      {preview && (
        <div className="mt-3 border border-brand-100 rounded-xl overflow-hidden">
          <div className="bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
            Xem trước ({preview.length} từ)
          </div>
          <div className="max-h-40 overflow-auto divide-y divide-gray-100">
            {preview.map((w, i) => (
              <div key={i} className="px-3 py-2 text-sm flex gap-3">
                <span className="hanzi font-semibold text-gray-800 w-20">{w.hanzi}</span>
                <span className="text-brand-600 italic w-28">{w.pinyin}</span>
                <span className="text-gray-500 flex-1">{w.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nut hanh dong */}
      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
        >
          Hủy
        </button>
        <button
          onClick={handlePreview}
          className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
        >
          👁 Xem trước
        </button>
        <button
          onClick={handleImportAll}
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold disabled:opacity-60"
        >
          {loading ? 'Đang nhập...' : '✅ Nhập tất cả'}
        </button>
      </div>
    </Modal>
  )
}