import { useState } from 'react'
import { askGemini } from '../../lib/aiClient.js'

export default function HskPractice({ lesson, level }) {
  const [mode, setMode] = useState(null) // 'vi2zh' | 'zh2vi'
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState({})
  const [checking, setChecking] = useState({})

  const vocab = lesson?.vocab || []
  const texts = lesson?.texts || []
  const grammar = lesson?.grammar || []
  const hskLevel = level?.levelNum || 1

  // Tao danh sach tu vung va ngu phap de gui cho AI
  function buildContext() {
    const vocabStr = vocab.map((w) => `${w.hanzi}(${w.pinyin}) = ${w.meaning}`).join('; ')
    const grammarStr = grammar.map((g) => g.title + ': ' + (g.content || '').slice(0, 100)).join('; ')
    const textStr = texts.map((t) => (t.content || '').slice(0, 200)).join(' ')
    return { vocabStr, grammarStr, textStr }
  }

  // Tao cau hoi luyen tap bang AI
  async function generateQuestions(type) {
    if (vocab.length < 2) {
      alert('Cần ít nhất 2 từ vựng trong bài để tạo câu hỏi luyện tập.')
      return
    }

    setMode(type)
    setLoading(true)
    setQuestions([])
    setAnswers({})
    setResults({})

    const { vocabStr, grammarStr } = buildContext()

    let prompt = ''
    if (type === 'vi2zh') {
      prompt = `Bạn là giáo viên tiếng Trung. Dựa trên từ vựng và ngữ pháp HSK ${hskLevel} sau:
Từ vựng: ${vocabStr}
Ngữ pháp: ${grammarStr || 'không có'}

Hãy tạo 5 câu tiếng Việt đơn giản, phù hợp cấp độ HSK ${hskLevel}, sử dụng từ vựng và ngữ pháp trên. Người học sẽ dịch các câu này sang tiếng Trung.

Trả về DUY NHẤT một mảng JSON, không giải thích, không backtick:
[{"vi":"câu tiếng Việt","zh":"câu tiếng Trung đúng","pinyin":"pinyin của câu","hint":"gợi ý ngữ pháp hoặc từ vựng cần dùng"}]`
    } else {
      prompt = `Bạn là giáo viên tiếng Trung. Dựa trên từ vựng và ngữ pháp HSK ${hskLevel} sau:
Từ vựng: ${vocabStr}
Ngữ pháp: ${grammarStr || 'không có'}

Hãy tạo 5 câu tiếng Trung đơn giản, phù hợp cấp độ HSK ${hskLevel}, sử dụng từ vựng và ngữ pháp trên. Người học sẽ dịch các câu này sang tiếng Việt.

Trả về DUY NHẤT một mảng JSON, không giải thích, không backtick:
[{"zh":"câu tiếng Trung","pinyin":"pinyin","vi":"nghĩa tiếng Việt đúng","hint":"gợi ý từ vựng chính trong câu"}]`
    }

    try {
      const raw = await askGemini(prompt)
      let cleaned = raw.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim()
      const match = cleaned.match(/\[[\s\S]*\]/)
      if (match) cleaned = match[0]
      const parsed = JSON.parse(cleaned)
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed)
      } else {
        alert('AI không tạo được câu hỏi. Vui lòng thử lại.')
      }
    } catch (err) {
      alert('Lỗi tạo câu hỏi: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // AI cham bai tung cau
  async function checkAnswer(index) {
    const q = questions[index]
    const userAnswer = (answers[index] || '').trim()
    if (!userAnswer) { alert('Vui lòng nhập câu trả lời.'); return }

    setChecking((p) => ({ ...p, [index]: true }))

    const correctAnswer = mode === 'vi2zh' ? q.zh : q.vi
    const questionText = mode === 'vi2zh' ? q.vi : q.zh

    const prompt = `Bạn là giáo viên tiếng Trung. Hãy chấm bài dịch của học sinh.

Câu gốc: ${questionText}
Đáp án đúng: ${correctAnswer}
Học sinh trả lời: ${userAnswer}

Hãy đánh giá và trả về DUY NHẤT một JSON, không giải thích, không backtick:
{"correct":true hoặc false,"score":điểm từ 0-10,"feedback":"nhận xét ngắn gọn bằng tiếng Việt về câu trả lời: đúng/sai chỗ nào, ngữ pháp đúng/sai thế nào, gợi ý sửa nếu sai","correctedAnswer":"câu trả lời đúng nhất"}`

    try {
      const raw = await askGemini(prompt)
      let cleaned = raw.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim()
      const match = cleaned.match(/\{[\s\S]*\}/)
      if (match) cleaned = match[0]
      const result = JSON.parse(cleaned)
      setResults((p) => ({ ...p, [index]: result }))
    } catch {
      setResults((p) => ({
        ...p,
        [index]: {
          correct: userAnswer === correctAnswer,
          score: userAnswer === correctAnswer ? 10 : 3,
          feedback: userAnswer === correctAnswer ? 'Chính xác!' : `Đáp án đúng là: ${correctAnswer}`,
          correctedAnswer: correctAnswer
        }
      }))
    } finally {
      setChecking((p) => ({ ...p, [index]: false }))
    }
  }

  // ===== Man hinh chon loai luyen tap =====
  if (!mode) {
    return (
      <div>
        <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
          <span>✏️</span> Luyện tập
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          AI sẽ tạo câu hỏi dựa trên từ vựng và ngữ pháp của bài học này. Chọn loại luyện tập:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dich Viet -> Trung */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:-translate-y-1 transition-all cursor-pointer"
            onClick={() => generateQuestions('vi2zh')}>
            <div className="text-3xl mb-3">🇻🇳 → 🇨🇳</div>
            <h3 className="font-bold text-gray-800 text-lg">Dịch Việt → Trung</h3>
            <p className="text-sm text-gray-500 mt-2">
              AI đưa ra câu tiếng Việt phù hợp với từ vựng và cấp độ đang học.
              Bạn dịch sang tiếng Trung. AI chấm đúng/sai và đánh giá ngữ pháp.
            </p>
            <div className="mt-4 text-blue-600 font-semibold text-sm">Bắt đầu luyện tập →</div>
          </div>

          {/* Dich Trung -> Viet */}
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:-translate-y-1 transition-all cursor-pointer"
            onClick={() => generateQuestions('zh2vi')}>
            <div className="text-3xl mb-3">🇨🇳 → 🇻🇳</div>
            <h3 className="font-bold text-gray-800 text-lg">Dịch Trung → Việt</h3>
            <p className="text-sm text-gray-500 mt-2">
              AI đưa ra câu tiếng Trung phù hợp với bài khóa và cấp độ đang học.
              Bạn dịch sang tiếng Việt. AI chấm đúng/sai và nhận xét.
            </p>
            <div className="mt-4 text-green-600 font-semibold text-sm">Bắt đầu luyện tập →</div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-2 text-sm text-blue-800">
            <span>🤖</span>
            <div><b>AI hỗ trợ:</b> Câu hỏi được tạo tự động từ từ vựng, bài khóa và ngữ pháp của bài học.
            AI sẽ chấm từng câu trả lời, đánh giá ngữ pháp và gợi ý sửa lỗi.</div>
          </div>
        </div>
      </div>
    )
  }

  // ===== Man hinh dang tai cau hoi =====
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <div className="w-10 h-10 mx-auto rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-3"></div>
        <p className="text-gray-500">🤖 AI đang tạo câu hỏi luyện tập...</p>
      </div>
    )
  }

  // ===== Man hinh lam bai =====
  const totalChecked = Object.keys(results).length
  const totalCorrect = Object.values(results).filter((r) => r.correct).length
  const totalScore = Object.values(results).reduce((sum, r) => sum + (r.score || 0), 0)
  const allDone = totalChecked === questions.length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800">
          {mode === 'vi2zh' ? '🇻🇳 → 🇨🇳 Dịch Việt sang Trung' : '🇨🇳 → 🇻🇳 Dịch Trung sang Việt'}
        </h2>
        <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-blue-600">← Chọn lại</button>
      </div>

      <div className="space-y-5">
        {questions.map((q, i) => {
          const r = results[i]
          const isChecking = checking[i]

          return (
            <div key={i} className={`bg-white rounded-2xl p-5 border-2 ${
              r ? (r.correct ? 'border-green-300 bg-green-50/30' : 'border-red-300 bg-red-50/30') : 'border-gray-200'
            }`}>
              {/* Cau hoi */}
              <div className="flex items-start gap-3 mb-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  r ? (r.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-blue-100 text-blue-700'
                }`}>{i + 1}</span>
                <div>
                  <p className={`font-semibold text-lg ${mode === 'zh2vi' ? 'hanzi' : ''} text-gray-800`}>
                    {mode === 'vi2zh' ? q.vi : q.zh}
                  </p>
                  {mode === 'zh2vi' && q.pinyin && <p className="text-sm text-blue-600 italic">{q.pinyin}</p>}
                  {q.hint && <p className="text-xs text-gray-400 mt-1">💡 Gợi ý: {q.hint}</p>}
                </div>
              </div>

              {/* O nhap tra loi */}
              <div className="ml-11">
                <textarea
                  value={answers[i] || ''}
                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                  disabled={!!r}
                  placeholder={mode === 'vi2zh' ? 'Nhập câu tiếng Trung...' : 'Nhập câu tiếng Việt...'}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border text-sm resize-none ${
                    r ? (r.correct ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-gray-200 focus:border-blue-500'
                  } ${mode === 'vi2zh' ? 'hanzi text-lg' : ''} outline-none`}
                />

                {/* Nut cham bai */}
                {!r && (
                  <button
                    onClick={() => checkAnswer(i)}
                    disabled={isChecking || !(answers[i] || '').trim()}
                    className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
                  >
                    {isChecking ? '🤖 AI đang chấm...' : '✅ Chấm bài'}
                  </button>
                )}

                {/* Ket qua cham */}
                {r && (
                  <div className={`mt-3 rounded-xl p-4 ${r.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-lg ${r.correct ? 'text-green-600' : 'text-red-600'}`}>
                        {r.correct ? '✅ Đúng!' : '❌ Chưa đúng'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        r.score >= 8 ? 'bg-green-100 text-green-700' :
                        r.score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{r.score}/10 điểm</span>
                    </div>

                    {/* Nhan xet AI */}
                    <p className="text-sm text-gray-700 mb-2">{r.feedback}</p>

                    {/* Dap an dung */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Đáp án đúng:</div>
                      <div className={`font-semibold text-gray-800 ${mode === 'vi2zh' ? 'hanzi text-lg' : ''}`}>
                        {r.correctedAnswer || (mode === 'vi2zh' ? q.zh : q.vi)}
                      </div>
                      {mode === 'vi2zh' && q.pinyin && <div className="text-sm text-blue-600 italic">{q.pinyin}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Ket qua tong */}
      {allDone && (
        <div className="mt-6 bg-blue-50 rounded-2xl p-6 border border-blue-200 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-lg font-bold text-gray-800">
            Kết quả: {totalCorrect}/{questions.length} câu đúng — {totalScore}/{questions.length * 10} điểm
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {totalCorrect === questions.length ? '🎉 Xuất sắc! Bạn đã hoàn thành tốt phần luyện tập.' :
             totalCorrect >= questions.length / 2 ? '👍 Khá tốt! Hãy ôn lại những câu sai và thử lại.' :
             '💪 Cần cố gắng thêm. Hãy xem lại từ vựng và ngữ pháp rồi thử lại nhé.'}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={() => { setMode(null); setQuestions([]); setAnswers({}); setResults({}) }}
              className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700">Chọn lại</button>
            <button onClick={() => generateQuestions(mode)}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">🔄 Làm bài mới</button>
          </div>
        </div>
      )}
    </div>
  )
}