import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Loader from '../components/Loader.jsx'
import WordList from './vocab/WordList.jsx'
import QuizPanel from './vocab/QuizPanel.jsx'
import FlashcardPanel from './vocab/FlashcardPanel.jsx'
import BulkImportModal from './vocab/BulkImportModal.jsx'
import { getLesson, getWords } from '../services/vocabService.js'
import { recordLessonOpen } from '../services/studyService.js'
import { formatDate } from '../utils/dateUtils.js'

export default function VocabularyLesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('vocab')
  const [showBulk, setShowBulk] = useState(false)

  async function loadAll() {
    setLoading(true)
    const ls = await getLesson(lessonId)
    const ws = await getWords(lessonId)
    setLesson(ls)
    setWords(ws || [])
    setLoading(false)

    // Ghi nhan nguoi dung mo bai hoc nay (cho danh gia hoc tap)
    if (ls) {
      recordLessonOpen(lessonId, ls.name, (ws || []).length)
    }
  }
  useEffect(() => { loadAll() }, [lessonId])

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/vocabulary')}
            className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold">← Quay lại</button>
          <h1 className="text-xl font-extrabold">{lesson?.name || 'Bài học'}</h1>
        </div>
      </div>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {loading ? <Loader text="Đang tải..." /> : (
            <>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-full bg-white shadow-soft text-sm text-gray-600">📄 {words.length} từ vựng</span>
                <span className="px-3 py-1.5 rounded-full bg-white shadow-soft text-sm text-gray-600">📅 Tạo: {formatDate(lesson?.created_at)}</span>
              </div>
              <div className="flex items-center gap-6 border-b border-brand-100 mb-5">
                <button onClick={() => setTab('vocab')}
                  className={`pb-2 text-sm font-semibold ${tab === 'vocab' ? 'text-brand-600 border-b-2 border-brand-500' : 'text-gray-500'}`}>📘 Từ vựng</button>
                <button onClick={() => setTab('flashcard')}
                  className={`pb-2 text-sm font-semibold ${tab === 'flashcard' ? 'text-brand-600 border-b-2 border-brand-500' : 'text-gray-500'}`}>🎴 Flashcard</button>
                <button onClick={() => setTab('quiz')}
                  className={`pb-2 text-sm font-semibold ${tab === 'quiz' ? 'text-brand-600 border-b-2 border-brand-500' : 'text-gray-500'}`}>✏️ Kiểm tra</button>
              </div>
              {tab === 'vocab' && (
                <WordList lessonId={lessonId} words={words} onReload={loadAll} onOpenBulk={() => setShowBulk(true)} />
              )}
              {tab === 'flashcard' && <FlashcardPanel lessonId={lessonId} words={words} />}
              {tab === 'quiz' && <QuizPanel lessonId={lessonId} words={words} />}
            </>
          )}
        </div>
      </main>
      <Footer />
      {showBulk && (
        <BulkImportModal lessonId={lessonId} onClose={() => setShowBulk(false)}
          onImported={() => { setShowBulk(false); loadAll() }} />
      )}
    </div>
  )
}