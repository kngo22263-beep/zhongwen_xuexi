import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { getCourse, getLevel } from '../services/hskService.js'

export default function HskLevel() {
  const { courseId, levelId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [level, setLevel] = useState(null)

  useEffect(() => {
    setCourse(getCourse(courseId))
    setLevel(getLevel(courseId, levelId))
  }, [courseId, levelId])

  if (!course || !level) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-gray-500">Không tìm thấy cấp độ này.</p>
            <button onClick={() => navigate('/hsk')} className="mt-4 px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold">← Quay lại</button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const lessons = level.lessons || []
  const completedCount = lessons.filter((l) => l.completed).length

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />

      <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <button onClick={() => navigate('/hsk')} className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold mb-3">← Quay lại</button>
          <h1 className="text-3xl font-extrabold">Cấp độ {level.name || `HSK ${level.levelNum}`}</h1>
          <p className="text-brand-100 mt-1">Hoàn thành bài hiện tại để mở khóa bài tiếp theo.</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-brand-100">
            <span>📖 {lessons.length} bài học</span>
            <span>✅ Đã hoàn thành: {completedCount}/{lessons.length}</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: lessons.length > 0 ? `${(completedCount / lessons.length) * 100}%` : '0%' }} />
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {lessons.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-brand-100 shadow-card">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-gray-500">Chưa có bài học nào trong cấp độ này.</p>
              <p className="text-gray-400 text-sm mt-1">Admin cần thêm bài học.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons
                .sort((a, b) => (a.lessonNum || 0) - (b.lessonNum || 0))
                .map((lesson, idx) => {
                  const vocabCount = lesson.vocab?.length || 0
                  const isCompleted = lesson.completed
                  const prevCompleted = idx === 0 || lessons[idx - 1]?.completed
                  const isLocked = !prevCompleted && !isCompleted

                  return (
                    <div
                      key={lesson.id}
                      className={`relative bg-white rounded-2xl p-5 border-2 transition-all shadow-card ${
                        isCompleted ? 'border-green-300 bg-green-50/30' :
                        isLocked ? 'border-gray-200 opacity-60' :
                        'border-brand-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer'
                      }`}
                      onClick={() => { if (!isLocked) navigate(`/hsk/${courseId}/${levelId}/${lesson.id}`) }}
                    >
                      {isCompleted && <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">✓</span>}
                      {isLocked && <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">🔒</span>}

                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                              isCompleted ? 'bg-green-100 text-green-700' :
                              isLocked ? 'bg-gray-100 text-gray-400' :
                              'bg-brand-100 text-brand-700'
                            }`}>{lesson.lessonNum}</span>
                            <h3 className="font-bold text-gray-800">
                              Bài {lesson.lessonNum}: <span className="hanzi">{lesson.title}</span>
                            </h3>
                          </div>
                          {lesson.titleVi && <p className="text-sm text-gray-500 ml-9">{lesson.titleVi}</p>}
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          isCompleted ? 'bg-green-100 text-green-700' :
                          isLocked ? 'bg-gray-100 text-gray-400' :
                          'bg-brand-100 text-brand-700'
                        }`}>{vocabCount} từ</span>
                      </div>

                      {!isLocked && (
                        <div className="flex flex-wrap gap-1 mt-3 ml-9">
                          {vocabCount > 0 && <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 text-xs">Từ vựng</span>}
                          {(lesson.texts?.length || 0) > 0 && <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs">Bài khóa</span>}
                          {(lesson.grammar?.length || 0) > 0 && <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs">Ngữ pháp</span>}
                          <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs">Luyện tập</span>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}