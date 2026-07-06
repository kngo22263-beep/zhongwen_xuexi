import { useEffect, useState } from 'react'
import Loader from '../../components/Loader.jsx'
import { getReadings, createReading, deleteReading } from '../../services/ebookService.js'
import { HSK_LEVELS } from '../../utils/constants.js'
import { countHanzi } from '../../lib/pinyin.js'
import { formatDate } from '../../utils/dateUtils.js'

export default function ImportReading() {
  const [title, setTitle] = useState('')
  const [hskLevel, setHskLevel] = useState('HSK1')
  const [topic, setTopic] = useState('')
  const [source, setSource] = useState('')
  const [content, setContent] = useState('')
  const [note, setNote] = useState('')

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    try { setList(await getReadings() || []) } catch { setList([]) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function handleSave() {
    setMsg('')
    if (!title.trim()) { setMsg('Vui lòng nhập tiêu đề / chủ đề.'); return }
    if (!content.trim()) { setMsg('Vui lòng nhập nội dung đoạn văn.'); return }
    setSaving(true)
    try {
      await createReading({
        title: title.trim(), hskLevel, topic: topic.trim(),
        source: source.trim(), content: content.trim(), note: note.trim()
      })
      setMsg('Đã lưu đoạn văn thành công!')
      setTitle(''); setTopic(''); setSource(''); setContent(''); setNote('')
      load()
    } catch (err) {
      setMsg('Lỗi: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Xóa đoạn văn "${name}"?`)) return
    try { await deleteReading(id); load() } catch (err) { alert('Lỗi: ' + err.message) }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">NHẬP DỮ LIỆU BÀI ĐỌC</h1>
      <p className="text-sm text-gray-500 mb-5">
        Thêm các đoạn văn chất lượng để AI học cách tạo đoạn văn tự nhiên, phù hợp ngữ cảnh.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Thông tin đoạn văn</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề / Chủ đề *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề hoặc chủ đề của đoạn văn..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cấp độ HSK *</label>
              <select value={hskLevel} onChange={(e) => setHskLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200">
                {HSK_LEVELS.map((lv) => <option key={lv} value={lv}>{lv.replace('HSK', 'HSK ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)}
                placeholder="VD: Du lịch, Gia đình..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nguồn (tùy chọn)</label>
            <input value={source} onChange={(e) => setSource(e.target.value)}
              placeholder="VD: Website, Sách, Báo..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung đoạn văn *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Dán hoặc nhập đoạn văn tại đây..." rows={5}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none resize-none hanzi" />
            <div className="text-right text-xs text-gray-400">{countHanzi(content)} chữ Hán</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
            <input value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Ngữ pháp nổi bật, từ vựng quan trọng..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
          </div>

          {msg && <div className="text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2">{msg}</div>}

          <div className="flex justify-end gap-3">
            <button onClick={() => { setTitle(''); setTopic(''); setSource(''); setContent(''); setNote('') }}
              className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700">Hủy</button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold disabled:opacity-60">
              {saving ? 'Đang lưu...' : 'Lưu đoạn văn'}
            </button>
          </div>
        </div>

        {/* Danh sach */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Danh sách đoạn văn ({list.length})</h2>
          {loading ? <Loader text="Đang tải..." /> : list.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Chưa có đoạn văn nào.</p>
          ) : (
            <div className="space-y-2 max-h-[520px] overflow-auto">
              {list.map((r) => (
                <div key={r.id} className="p-3 rounded-xl border border-brand-100 hover:bg-brand-50/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="hanzi font-semibold text-gray-800">{r.title}</span>
                      <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-700 text-xs font-semibold">
                        {r.hsk_level?.replace('HSK', 'HSK ')}
                      </span>
                    </div>
                    <button onClick={() => handleDelete(r.id, r.title)} className="text-gray-300 hover:text-red-500">🗑️</button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {r.topic || 'Chưa phân loại'} · {countHanzi(r.content)} chữ · {formatDate(r.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}