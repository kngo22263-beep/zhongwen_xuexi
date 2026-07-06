import { useState } from 'react'
import Modal from '../../components/Modal.jsx'
import { createLesson } from '../../services/vocabService.js'

export default function AddLessonModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!name.trim()) { setError('Vui lòng nhập tên bài học.'); return }
    await createLesson({ name: name.trim(), description: description.trim() })
    onCreated?.()
  }

  return (
    <Modal open={true} onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">📚</span>
        <h3 className="text-2xl font-extrabold text-gray-800">Thêm bài học mới</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tên bài học:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus
            placeholder="VD: Bài 1, Chủ đề gia đình..."
            className="w-full px-4 py-2.5 rounded-lg border border-brand-300 focus:border-brand-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung / Mô tả (tùy chọn):</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
        </div>
        {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700">Hủy</button>
          <button onClick={handleCreate} className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold">Tạo bài học</button>
        </div>
      </div>
    </Modal>
  )
}