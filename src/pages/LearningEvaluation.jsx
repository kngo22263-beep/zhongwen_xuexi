import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { getTodaySessions, getTodayStudyTime, getTodayEvaluation, getEvaluationHistory } from '../services/studyService.js'
import { evaluateToday } from '../services/evaluationService.js'
import { formatDate } from '../utils/dateUtils.js'

function scoreColor(s) { return s >= 85 ? 'bg-green-500' : s >= 70 ? 'bg-blue-500' : s >= 55 ? 'bg-yellow-500' : s >= 40 ? 'bg-orange-500' : 'bg-red-500' }
function levelColor(s) { return s >= 85 ? 'text-green-600 bg-green-50' : s >= 70 ? 'text-blue-600 bg-blue-50' : s >= 55 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50' }

// Chuyen text AI thanh HTML dep
function formatAiReport(text) {
  if (!text) return ''
  return text
    .replace(/^## (.+)$/gm, '<h3 class="text-lg font-bold text-gray-800 mt-5 mb-2">$1</h3>')
    .replace(/^### (.+)$/gm, '<h4 class="font-bold text-gray-700 mt-3 mb-1">$1</h4>')
    .replace(/^- ✅ (.+)$/gm, '<div class="flex gap-2 text-sm py-0.5"><span class="text-green-500">✅</span><span>$1</span></div>')
    .replace(/^- ❌ (.+)$/gm, '<div class="flex gap-2 text-sm py-0.5"><span class="text-red-500">❌</span><span>$1</span></div>')
    .replace(/^- (.+)$/gm, '<div class="flex gap-2 text-sm py-0.5"><span class="text-brand-500">•</span><span>$1</span></div>')
    .replace(/★/g, '<span class="text-yellow-500">★</span>')
    .replace(/☆/g, '<span class="text-gray-300">☆</span>')
    .replace(/\n\n/g, '<div class="my-2"></div>')
    .replace(/\n/g, '<br/>')
}

function EvalCard({ ev }) {
  const sc = ev.score || 0
  return (
    <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6 space-y-4">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#f3f4f6" strokeWidth="6" />
            <circle cx="40" cy="40" r="35" fill="none" stroke={sc >= 70 ? '#22c55e' : sc >= 55 ? '#eab308' : '#ef4444'}
              strokeWidth="6" strokeDasharray={`${(sc / 100) * 220} 220`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold">{sc}</span>
        </div>
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${levelColor(sc)}`}>{ev.level}</span>
          <p className="text-sm text-gray-500 mt-1">{ev.sessionsCount || 0} bài · {ev.totalWords || 0} từ · {ev.studyMinutes || 0} phút</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-brand-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-brand-600">{ev.totalFlashViewed || 0}</div><div className="text-xs text-gray-500">Flashcard xem</div></div>
        <div className="bg-green-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-green-600">{ev.totalFlashKnown || 0}</div><div className="text-xs text-gray-500">Đã thuộc</div></div>
        <div className="bg-blue-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-blue-600">{ev.totalQuiz || 0}</div><div className="text-xs text-gray-500">Câu kiểm tra</div></div>
        <div className="bg-purple-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-purple-600">{ev.accuracy || 0}%</div><div className="text-xs text-gray-500">Chính xác</div></div>
      </div>

      {ev.aiReport ? (
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatAiReport(ev.aiReport) }} />
      ) : (
        <p className="text-sm text-gray-400">Không có báo cáo AI.</p>
      )}

      {ev.lessonNames?.length > 0 && <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">📚 Bài đã học: {ev.lessonNames.join(', ')}</div>}
    </div>
  )
}

export default function LearningEvaluation() {
  const [sessions, setSessions] = useState([])
  const [studyMinutes, setStudyMinutes] = useState(0)
  const [todayEval, setTodayEval] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [viewHistory, setViewHistory] = useState(null)

  useEffect(() => {
    setSessions(getTodaySessions())
    setStudyMinutes(Math.round(getTodayStudyTime() / 60))
    setTodayEval(getTodayEvaluation())
    setHistory(getEvaluationHistory())
  }, [])

  let totalWords = 0, totalFlash = 0, totalKnown = 0, totalQuiz = 0, totalCorrect = 0
  sessions.forEach((s) => {
    totalWords += s.words_total || 0
    totalFlash += s.flashcards_viewed || 0
    totalKnown += s.flashcards_known || 0
    totalQuiz += s.quiz_total || 0
    totalCorrect += s.quiz_correct || 0
  })
  const accuracy = totalQuiz > 0 ? Math.round((totalCorrect / totalQuiz) * 100) : 0

  async function handleEvaluate() {
    setError(''); setLoading(true)
    try {
      const result = await evaluateToday()
      setTodayEval(result)
      setHistory(getEvaluationHistory())
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center text-white text-xl">📊</span>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Đánh giá học tập</h1>
              <p className="text-sm text-gray-500">AI phân tích số liệu thực tế và đánh giá chi tiết hiệu quả học tập</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-3">📅 Hoạt động học hôm nay</h2>
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-400">Bạn chưa học bài nào hôm nay. Vào phần <b>Từ vựng</b> để bắt đầu!</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="bg-brand-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-brand-600">{sessions.length}</div><div className="text-xs text-gray-500">Bài đã học</div></div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-blue-600">{totalWords}</div><div className="text-xs text-gray-500">Từ vựng</div></div>
                  <div className="bg-green-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-green-600">{totalFlash}</div><div className="text-xs text-gray-500">Flashcard</div></div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-purple-600">{totalQuiz > 0 ? `${accuracy}%` : '—'}</div><div className="text-xs text-gray-500">Kiểm tra</div></div>
                  <div className="bg-orange-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-orange-600">{studyMinutes}</div><div className="text-xs text-gray-500">Phút học</div></div>
                </div>
                <div className="space-y-2">
                  {sessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-brand-50/50 text-sm">
                      <span className="font-semibold text-gray-800">{s.lesson_name}</span>
                      <span className="text-gray-500">{s.words_total} từ · FC: {s.flashcards_viewed}/{s.flashcards_known} · KT: {s.quiz_correct}/{s.quiz_total}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {!todayEval ? (
            <div className="text-center mb-6">
              <button onClick={handleEvaluate} disabled={loading || sessions.length === 0}
                className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-card disabled:opacity-50 text-lg">
                {loading ? '🤖 AI đang phân tích số liệu và viết đánh giá...' : '📊 Kết thúc buổi học & Đánh giá hôm nay'}
              </button>
              {error && <div className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 inline-block">{error}</div>}
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="font-bold text-gray-800 mb-3">🎯 Kết quả đánh giá hôm nay</h2>
              <EvalCard ev={todayEval} />
              <div className="text-center mt-4">
                <button onClick={() => { setTodayEval(null); localStorage.removeItem('zhongwen_study_evaluations') }}
                  className="text-sm text-gray-400 hover:text-brand-500">🔄 Đánh giá lại</button>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-800 mb-3">📋 Lịch sử đánh giá</h2>
              <div className="space-y-3">
                {history.map((ev, i) => (
                  <div key={i}>
                    <div onClick={() => setViewHistory(viewHistory === i ? null : i)}
                      className="cursor-pointer bg-white rounded-xl p-4 shadow-soft border border-brand-100 flex items-center justify-between hover:bg-brand-50/40">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${scoreColor(ev.score)}`}>{ev.score}</div>
                        <div>
                          <span className="font-semibold text-gray-800">{formatDate(ev.date)}</span>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${levelColor(ev.score)}`}>{ev.level}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{ev.sessionsCount || 0} bài · {ev.totalWords || 0} từ {viewHistory === i ? '▲' : '▼'}</span>
                    </div>
                    {viewHistory === i && <div className="mt-2"><EvalCard ev={ev} /></div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}