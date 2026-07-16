import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { getTodaySessions, getTodayStudyTime, getTodayEvaluation, getEvaluationHistory } from '../services/studyService.js'
import { evaluateToday } from '../services/evaluationService.js'
import { formatDate } from '../utils/dateUtils.js'

// Mau theo muc do
function levelColor(level) {
  if (level === 'Xuất sắc' || level === 'Xuat sac') return 'text-green-600 bg-green-50 border-green-200'
  if (level === 'Tốt' || level === 'Tot') return 'text-blue-600 bg-blue-50 border-blue-200'
  if (level === 'Khá' || level === 'Kha') return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  return 'text-red-600 bg-red-50 border-red-200'
}

// Mau thanh diem
function scoreColor(score) {
  if (score >= 90) return 'bg-green-500'
  if (score >= 75) return 'bg-blue-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
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

  // Tinh tong
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
    setError('')
    setLoading(true)
    try {
      const result = await evaluateToday()
      setTodayEval(result)
      setHistory(getEvaluationHistory())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Hien thi 1 ket qua danh gia (hom nay hoac lich su)
  function EvalCard({ ev }) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6 space-y-4">
        {/* Diem + muc do */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#f3f4f6" strokeWidth="6" />
              <circle cx="40" cy="40" r="35" fill="none" stroke={ev.score >= 75 ? '#22c55e' : ev.score >= 60 ? '#eab308' : '#ef4444'}
                strokeWidth="6" strokeDasharray={`${(ev.score / 100) * 220} 220`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-gray-800">{ev.score}</span>
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${levelColor(ev.level)}`}>{ev.level}</span>
            <p className="text-sm text-gray-500 mt-1">{ev.sessionsCount || 0} bài · {ev.totalWords || 0} từ · {ev.studyMinutes || 0} phút</p>
          </div>
        </div>

        {/* Thong ke nhanh */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-brand-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-brand-600">{ev.totalFlashViewed || 0}</div>
            <div className="text-xs text-gray-500">Flashcard đã xem</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{ev.totalFlashKnown || 0}</div>
            <div className="text-xs text-gray-500">Đã thuộc</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{ev.totalQuiz || 0}</div>
            <div className="text-xs text-gray-500">Câu kiểm tra</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{ev.accuracy || 0}%</div>
            <div className="text-xs text-gray-500">Chính xác</div>
          </div>
        </div>

        {/* Nhan xet AI */}
        {ev.summary && (
          <div className="bg-brand-50 rounded-xl p-4">
            <h4 className="font-bold text-gray-800 mb-1">📝 Nhận xét của AI</h4>
            <p className="text-sm text-gray-700">{ev.summary}</p>
          </div>
        )}

        {/* Diem manh */}
        {ev.strengths && ev.strengths.length > 0 && (
          <div>
            <h4 className="font-bold text-green-700 mb-1">💪 Điểm mạnh</h4>
            <ul className="space-y-1">{ev.strengths.map((s, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-green-500">✓</span>{s}</li>)}</ul>
          </div>
        )}

        {/* Diem yeu */}
        {ev.weaknesses && ev.weaknesses.length > 0 && (
          <div>
            <h4 className="font-bold text-red-600 mb-1">⚠️ Cần cải thiện</h4>
            <ul className="space-y-1">{ev.weaknesses.map((s, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-red-400">•</span>{s}</li>)}</ul>
          </div>
        )}

        {/* Tu con yeu */}
        {ev.weakWords && ev.weakWords.length > 0 && (
          <div>
            <h4 className="font-bold text-orange-600 mb-1">📖 Từ vựng cần ôn lại</h4>
            <div className="flex flex-wrap gap-2">
              {ev.weakWords.map((w, i) => <span key={i} className="hanzi px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-semibold border border-orange-200">{w}</span>)}
            </div>
          </div>
        )}

        {/* Goi y */}
        {ev.recommendations && ev.recommendations.length > 0 && (
          <div>
            <h4 className="font-bold text-blue-700 mb-1">💡 Gợi ý cho ngày mai</h4>
            <ul className="space-y-1">{ev.recommendations.map((s, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-blue-500">→</span>{s}</li>)}</ul>
          </div>
        )}

        {/* Bai da hoc */}
        {ev.lessonNames && ev.lessonNames.length > 0 && (
          <div className="text-xs text-gray-400">📚 Bài đã học: {ev.lessonNames.join(', ')}</div>
        )}
      </div>
    )
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
              <p className="text-sm text-gray-500">AI tổng hợp và đánh giá hiệu quả học tập của bạn</p>
            </div>
          </div>

          {/* Hoat dong hom nay */}
          <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-3">📅 Hoạt động học hôm nay</h2>
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-400">Bạn chưa học bài nào hôm nay. Vào phần <b>Từ vựng</b> để bắt đầu!</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="bg-brand-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-brand-600">{sessions.length}</div>
                    <div className="text-xs text-gray-500">Bài đã học</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalWords}</div>
                    <div className="text-xs text-gray-500">Từ vựng</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{totalFlash}</div>
                    <div className="text-xs text-gray-500">Flashcard</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{totalQuiz > 0 ? `${accuracy}%` : '—'}</div>
                    <div className="text-xs text-gray-500">Kiểm tra</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">{studyMinutes}</div>
                    <div className="text-xs text-gray-500">Phút học</div>
                  </div>
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

          {/* Nut danh gia + ket qua */}
          {!todayEval ? (
            <div className="text-center mb-6">
              <button onClick={handleEvaluate} disabled={loading || sessions.length === 0}
                className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-card disabled:opacity-50 text-lg">
                {loading ? 'AI đang đánh giá...' : '📊 Kết thúc buổi học & Đánh giá hôm nay'}
              </button>
              {error && <div className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 inline-block">{error}</div>}
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="font-bold text-gray-800 mb-3">🎯 Kết quả đánh giá hôm nay</h2>
              <EvalCard ev={todayEval} />
            </div>
          )}

          {/* Lich su danh gia */}
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
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${levelColor(ev.level)}`}>{ev.level}</span>
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