import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Loader from '../components/Loader.jsx'
import { getCourse, getLevel, getHskLesson, toggleLessonComplete } from '../services/hskService.js'
import HskVocab from './hsk/HskVocab.jsx'
import HskText from './hsk/HskText.jsx'
import HskGrammar from './hsk/HskGrammar.jsx'
import HskPractice from './hsk/HskPractice.jsx'
import HskFlashcard from './hsk/HskFlashcard.jsx'

const TABS = [
  { id: 'vocab', label: 'Từ vựng', icon: '📝' },
  { id: 'text', label: 'Bài khóa', icon: '📖' },
  { id: 'grammar', label: 'Ngữ pháp', icon: '📐' },
  { id: 'practice', label: 'Luyện tập', icon: '✏️' }
]

export default function HskLesson() {
  const { courseId, levelId, lessonId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [level, setLevel] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [tab, setTab] = useState('vocab')
  const [showFlashcard, setShowFlashcard] = useState(false)

  function loadData() {
    setCourse(getCourse(courseId))
    setLevel(getLevel(courseId, levelId))
    setLesson(getHskLesson(courseId, levelId, lessonId))
  }

  useEffect(() => { loadData() }, [courseId, levelId, lessonId])

  function handleComplete() {
    toggleLessonComplete(courseId, levelId, lessonId)
    loadData()
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-gray-500">Không tìm thấy bài học này.</p>
            <button onClick={() => navigate(-1)} className="mt-4 px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold">← Quay lại</button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const vocabCount = lesson.vocab?.length || 0

  if (showFlashcard) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-50">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <button onClick={() => setShowFlashcard(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 mb-4">
              ← Quay lại bài học
            </button>
            <HskFlashcard words={lesson.vocab || []} />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />

      <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={() => navigate(`/hsk/${courseId}/${levelId}`)}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold mb-2">
                ← Quay lại
              </button>
              <h1 className="text-2xl font-extrabold">
                <span className="hanzi">{lesson.title}</span>
                {lesson.titleVi && <span className="text-brand-100 text-lg ml-2">({lesson.titleVi})</span>}
              </h1>
              <p className="text-brand-100 text-sm mt-1">
                {vocabCount} từ vựng • {level?.name || `HSK ${level?.levelNum || ''}`}
              </p>
            </div>

            <button onClick={handleComplete}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all ${
                lesson.completed
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-white text-brand-700 hover:bg-brand-50'
              }`}>
              {lesson.completed ? '✅ Đã hoàn thành' : 'Hoàn thành bài học'}
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between border-b border-brand-100 mb-6">
            <div className="flex items-center gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    tab === t.id
                      ? 'text-brand-600 border-brand-500'
                      : 'text-gray-500 border-transparent hover:text-brand-500'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <button onClick={() => setShowFlashcard(true)}
              className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-card">
              🎴 Flashcard
            </button>
          </div>

          {tab === 'vocab' && (
            <HskVocab
              courseId={courseId} levelId={levelId} lessonId={lessonId}
              words={lesson.vocab || []} onReload={loadData}
            />
          )}
          {tab === 'text' && (
            <HskText
              courseId={courseId} levelId={levelId} lessonId={lessonId}
              texts={lesson.texts || []} onReload={loadData}
            />
          )}
          {tab === 'grammar' && (
            <HskGrammar
              courseId={courseId} levelId={levelId} lessonId={lessonId}
              grammar={lesson.grammar || []} onReload={loadData}
            />
          )}
          {tab === 'practice' && (
            <HskPractice lesson={lesson} level={level} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}