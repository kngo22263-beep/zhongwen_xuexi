import { useEffect, useState } from 'react'
import Loader from '../../components/Loader.jsx'
import { getEbooks, createEbook, deleteEbook } from '../../services/ebookService.js'
import { HSK_LEVELS } from '../../utils/constants.js'

export default function ImportEbook() {
  const [title, setTitle] = useState('')
  const [hskLevel, setHskLevel] = useState('HSK1')
  const [course, setCourse] = useState('HSK2.0')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    try {
      setBooks(await getEbooks() || [])
    } catch {
      setBooks([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  async function handleSave() {
    setMsg('')
    if (!title.trim()) { setMsg('Vui lòng nhập tiêu đề sách.'); return }
    setSaving(true)
    try {
      await createEbook({
        title: title.trim(), hskLevel, course,
        author: author.trim(), description: description.trim(),
        fileUrl: fileUrl.trim(), isPublic
      })
      setMsg('Đã lưu ebook thành công!')
      setTitle(''); setAuthor(''); setDescription(''); setFileUrl('')
      load()
    } catch (err) {
      setMsg('Lỗi: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Xóa sách "${name}"?`)) return
    try { await deleteEbook(id); load() } catch (err) { alert('Lỗi: ' + err.message) }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">NHẬP DỮ LIỆU EBOOK</h1>
      <p className="text-sm text-gray-500 mb-5">Thêm mới ebook vào hệ thống</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form nhap */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Thông tin ebook</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề sách *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề sách..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cấp độ (HSK) *</label>
              <select value={hskLevel} onChange={(e) => setHskLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200">
                {HSK_LEVELS.map((lv) => <option key={lv} value={lv}>{lv.replace('HSK', 'HSK ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giáo trình</label>
              <select value={course} onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200">
                <option value="HSK2.0">HSK 2.0</option>
                <option value="HSK3.0">HSK 3.0</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tác giả</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nhập tên tác giả..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả sách</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả sách (tùy chọn)..." rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Link file sách (PDF) *</label>
            <input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Dán đường link file PDF (VD tren Supabase Storage / Google Drive)..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
            <p className="text-xs text-gray-400 mt-1">Chỉ hỗ trợ file PDF. Dung lượng tối đa 50MB.</p>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-brand-500" />
            Công khai (mọi người xem được). Bỏ chọn = riêng tư.
          </label>

          {msg && <div className="text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2">{msg}</div>}

          <div className="flex justify-end gap-3">
            <button onClick={() => { setTitle(''); setAuthor(''); setDescription(''); setFileUrl('') }}
              className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700">Hủy</button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold disabled:opacity-60">
              {saving ? 'Đang lưu...' : 'Lưu dữ liệu'}
            </button>
          </div>
        </div>

        {/* Danh sach ebook */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Danh sách ebook</h2>
          {loading ? <Loader text="Đang tải..." /> : books.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Chưa có ebook nào.</p>
          ) : (
            <div className="space-y-2 max-h-[520px] overflow-auto">
              {books.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-xl border border-brand-100 hover:bg-brand-50/40">
                  <div>
                    <div className="font-semibold text-gray-800">{b.title}</div>
                    <div className="text-xs text-gray-400">
                      {b.hsk_level?.replace('HSK', 'HSK ')} · {b.course} · {b.is_public ? 'Công khai' : 'Riêng tư'}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(b.id, b.title)} className="text-gray-300 hover:text-red-500">🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}