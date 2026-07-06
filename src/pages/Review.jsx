import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Toggle from '../components/Toggle.jsx'
import Loader from '../components/Loader.jsx'
import { generateReviewPassage } from '../services/reviewService.js'
import { HSK_LEVELS, SENTENCE_COUNTS } from '../utils/constants.js'

export default function Review() {
  const [vocabInput, setVocabInput] = useState('')
  const [sentenceCount, setSentenceCount] = useState(20)
  const [hskLevel, setHskLevel] = useState('HSK1')

  const [showPinyin, setShowPinyin] = useState(false)
  const [showMeaning, setShowMeaning] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null) // { lines: [{hanzi, pinyin, meaning}], level, count }

  async function handleGenerate() {
    setError('')
    if (!vocabInput.trim()) {
      setError('Vui lòng nhập ít nhất một từ vựng.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const data = await generateReviewPassage({
        vocab: vocabInput,
        sentenceCount,
        hskLevel
      })
      setResult(data)
    } catch (err) {
      setError(err.message || 'Không tạo được đoạn văn. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!result) return
    const text = result.lines.map((l) => l.hanzi).join('')
    navigator.clipboard.writeText(text)
    alert('Đã sao chép đoạn văn!')
  }

  function handleDownload() {
    if (!result) return
    const text = result.lines
      .map((l) => {
        let s = l.hanzi
        if (showPinyin && l.pinyin) s += '\n' + l.pinyin
        if (showMeaning && l.meaning) s += '\n' + l.meaning
        return s
      })
      .join('\n\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'doan-van-on-tap.txt'
    a.click()
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Tieu de + toggle pinyin/nghia */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center text-white text-xl">
                ✅
              </span>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800">Tạo đoạn văn ôn tập</h1>
                <p className="text-sm text-gray-500">
                  Nhập từ vựng của bạn và chọn cấp độ, hệ thống sẽ tạo đoạn văn phù hợp để ôn tập.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 bg-white rounded-xl px-4 py-2 shadow-soft border border-brand-100">
              <Toggle label="Bật pinyin" checked={showPinyin} onChange={setShowPinyin} />
              <Toggle label="Bật nghĩa tiếng Việt" checked={showMeaning} onChange={setShowMeaning} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ===== COT TRAI: nhap lieu ===== */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-100 space-y-5">
              {/* 1. Nhap tu vung */}
              <div>
                <label className="block font-bold text-gray-800 mb-2">1. Nhập từ vựng của bạn</label>
                <textarea
                  value={vocabInput}
                  onChange={(e) => setVocabInput(e.target.value.slice(0, 500))}
                  placeholder="Nhập từ vựng (cách nhau bằng dấu phẩy, Enter hoặc xuống dòng)..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none resize-none"
                />
                <div className="text-right text-xs text-gray-400">{vocabInput.length}/500</div>
              </div>

              {/* 2. So cau */}
              <div>
                <label className="block font-bold text-gray-800 mb-2">2. Chọn số câu trong đoạn văn</label>
                <div className="flex gap-2">
                  {SENTENCE_COUNTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSentenceCount(c)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                        sentenceCount === c
                          ? 'bg-brand-100 border-brand-400 text-brand-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300'
                      }`}
                    >
                      {c} câu
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Cap do HSK */}
              <div>
                <label className="block font-bold text-gray-800 mb-2">3. Chọn cấp độ HSK</label>
                <select
                  value={hskLevel}
                  onChange={(e) => setHskLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none"
                >
                  {HSK_LEVELS.map((lv) => (
                    <option key={lv} value={lv}>{lv.replace('HSK', 'HSK ')}</option>
                  ))}
                </select>
              </div>

              {/* Nut tao */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-card disabled:opacity-60"
              >
                {loading ? 'Đang tạo...' : '✍️ Tạo đoạn văn'}
              </button>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              {/* Meo nho */}
              <div className="flex items-start gap-2 text-sm text-gray-500 bg-brand-50 rounded-xl p-3">
                <span>💡</span>
                <span>
                  <b>Mẹo nhỏ:</b> Nhập các từ vựng bạn muốn ôn tập để tạo đoạn văn có chứa những từ đó.
                </span>
              </div>
            </div>

            {/* ===== COT PHAI: ket qua ===== */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-100 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Đoạn văn ôn tập</h3>
                {result && (
                  <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
                    {result.level.replace('HSK', 'HSK ')} · {result.count} câu
                  </span>
                )}
              </div>

              <div className="flex-1 min-h-[260px] rounded-xl bg-brand-50/50 p-5 overflow-auto">
                {loading ? (
                  <Loader text="AI đang tạo đoạn văn..." />
                ) : result ? (
                  <div className="space-y-4 leading-relaxed">
                    {result.lines.map((line, i) => (
                      <div key={i}>
                        <p className="hanzi text-lg text-gray-800">{line.hanzi}</p>
                        {showPinyin && line.pinyin && (
                          <p className="text-sm text-brand-600 italic">{line.pinyin}</p>
                        )}
                        {showMeaning && line.meaning && (
                          <p className="text-sm text-gray-500">{line.meaning}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-gray-400">
                    Nhập từ vựng và bấm "Tạo đoạn văn" để bắt đầu.
                  </div>
                )}
              </div>

              {/* Nut hanh dong */}
              {result && (
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={handleGenerate}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700"
                  >
                    🔄 Tạo lại
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700"
                  >
                    📋 Sao chép
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold"
                  >
                    ⬇ Tải xuống
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}