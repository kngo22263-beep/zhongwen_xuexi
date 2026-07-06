import { useState } from 'react'
import { generateQuiz, generateMatchQuiz } from '../../services/quizService.js'
import { QUIZ_TYPES, QUESTION_COUNTS, DIFFICULTY_LEVELS } from '../../utils/constants.js'

export default function QuizPanel({ words }) {
  const [running, setRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  async function handleStart(type, count, topic) {
    if (!words || words.length < 3) { alert('Cần ít nhất 3 từ vựng trong bài để tạo câu hỏi.'); return }
    setAnswers({}); setSubmitted(false)
    if (type === 'match') {
      setLoading(true)
      try {
        const qs = await generateMatchQuiz({ words, count, topic })
        if (!qs.length) { alert('Không tạo được câu hỏi.'); return }
        setQuestions(qs); setRunning(true)
      } catch (e) { alert('Lỗi tạo câu hỏi: ' + e.message) } finally { setLoading(false) }
    } else {
      const qs = generateQuiz({ words, type, count, topic })
      if (!qs.length) { alert('Không tạo được câu hỏi.'); return }
      setQuestions(qs); setRunning(true)
    }
  }

  function score() {
    let c = 0
    questions.forEach((q, i) => { if ((answers[i] || '').trim() === q.answer.trim()) c++ })
    return c
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-brand-100">
        <div className="w-10 h-10 mx-auto rounded-full border-4 border-brand-200 border-t-brand-500 animate-spin mb-3"></div>
        <p className="text-gray-500">AI đang tạo câu hỏi...</p>
      </div>
    )
  }

  if (running) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Bài kiểm tra ({questions.length} câu)</h3>
          <button onClick={() => setRunning(false)} className="text-sm text-gray-400 hover:text-brand-500">← Thoát</button>
        </div>
        <div className="space-y-5">
          {questions.map((q, i) => {
            const isRight = submitted && (answers[i] || '').trim() === q.answer.trim()
            return (
              <div key={i} className="border-b border-gray-100 pb-4">
                <p className="font-semibold text-gray-800 mb-2 hanzi">Câu {i + 1}: {q.question}</p>
                {q.options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, j) => {
                      const chosen = answers[i] === opt
                      const isCorrect = submitted && opt === q.answer
                      const isWrong = submitted && chosen && opt !== q.answer
                      return (
                        <button key={j} disabled={submitted} onClick={() => setAnswers({ ...answers, [i]: opt })}
                          className={`text-left px-3 py-2 rounded-lg border text-sm hanzi ${
                            isCorrect ? 'bg-green-50 border-green-400 text-green-700'
                            : isWrong ? 'bg-red-50 border-red-400 text-red-700'
                            : chosen ? 'bg-brand-50 border-brand-400' : 'border-gray-200 hover:border-brand-300'}`}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <input value={answers[i] || ''} disabled={submitted}
                    onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                    placeholder="Nhập câu đúng..."
                    className={`w-full px-3 py-2 rounded-lg border text-sm hanzi ${
                      submitted ? (isRight ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-gray-200'}`} />
                )}
                {submitted && (
                  <div className={`mt-2 text-sm rounded-lg px-3 py-2 ${isRight ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <span className="font-semibold">{isRight ? '✅ Đúng' : '❌ Sai'} — Đáp án đúng:</span>
                    <div className="hanzi text-base font-bold text-gray-800 mt-1">{q.answer}</div>
                    {q.answerPinyin && <div className="text-purple-600 italic">{q.answerPinyin}</div>}
                    {q.answerMeaning && <div className="text-gray-600">{q.answerMeaning}</div>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} className="mt-5 w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold">Nộp bài</button>
        ) : (
          <div className="mt-5 text-center bg-brand-50 rounded-xl p-4">
            <p className="text-lg font-bold text-brand-700">Kết quả: {score()} / {questions.length} câu đúng</p>
            <button onClick={() => setRunning(false)} className="mt-3 px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold">Làm bài khác</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {QUIZ_TYPES.map((qt, idx) => <QuizCard key={qt.id} index={idx + 1} config={qt} onStart={handleStart} />)}
    </div>
  )
}

function QuizCard({ index, config, onStart }) {
  const [count, setCount] = useState(10)
  const [topic, setTopic] = useState(config.topics[0])
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS[0])
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-brand-100">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">{index}</span>
        <h3 className="font-bold text-gray-800">{config.title}</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">{config.desc}</p>
      <label className="block text-xs font-semibold text-gray-600 mb-1">Số câu hỏi:</label>
      <div className="flex gap-1 mb-3">
        {QUESTION_COUNTS.map((c) => (
          <button key={c} onClick={() => setCount(c)}
            className={`px-2.5 py-1 rounded text-xs font-semibold border ${count === c ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-200 text-gray-600'}`}>{c}</button>
        ))}
      </div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">Chủ đề:</label>
      <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-3">
        {config.topics.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <label className="block text-xs font-semibold text-gray-600 mb-1">Mức độ:</label>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-4">
        {DIFFICULTY_LEVELS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <div className="flex items-start gap-2 text-xs text-gray-500 bg-brand-50 rounded-lg p-2 mb-4">
        <span>💡</span><span>{config.hint}</span>
      </div>
      <button onClick={() => onStart(config.id, count, topic)} className="w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold">🎯 Bắt đầu kiểm tra</button>
    </div>
  )
}