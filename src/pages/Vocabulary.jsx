import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Loader from '../components/Loader.jsx'
import AddLessonModal from './vocab/AddLessonModal.jsx'
import { getLessons, deleteLesson } from '../services/vocabService.js'
import { formatDate } from '../utils/dateUtils.js'

export default function Vocabulary() {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  async function loadLessons() {
    setLoading(true)
    try { setLessons(await getLessons() || []) } catch { setLessons([]) } finally { setLoading(false) }
  }
  useEffect(() => { loadLessons() }, [])

  async function handleDelete(e, lesson) {
    e.stopPropagation()
    if (!window.confirm(`Xóa bài học "${lesson.name}"?`)) return
    await deleteLesson(lesson.id)
    loadLessons()
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center text-white text-xl">📚</span>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800">Danh sách bài học</h1>
                <p className="text-sm text-gray-500">Tạo các bài học từ vựng riêng biệt</p>
              </div>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="px-4 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-card whitespace-nowrap">
              + Thêm bài học
            </button>
          </div>

          {loading ? <Loader text="Đang tải..." /> : lessons.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-brand-100">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-gray-500">Chưa có bài học. Nhấn <b>"+ Thêm bài học"</b> để bắt đầu!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} onClick={() => navigate(`/vocabulary/${lesson.id}`)}
                  className="cursor-pointer bg-white rounded-2xl p-5 shadow-card border-l-4 border-brand-500 hover:-translate-y-1 transition-transform">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{lesson.name}</h3>
                      {lesson.description && <p className="text-xs text-gray-400 mt-1">{lesson.description}</p>}
                      <p className="text-xs text-gray-400 mt-1">📅 {formatDate(lesson.created_at)}</p>
                    </div>
                    <button onClick={(e) => handleDelete(e, lesson)} className="text-gray-300 hover:text-red-500" title="Xóa">🗑️</button>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-semibold">
                      📄 {lesson.word_count ?? 0} từ vựng
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      {showAdd && (
        <AddLessonModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); loadLessons() }} />
      )}
    </div>
  )
}