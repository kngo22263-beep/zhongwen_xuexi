import { useState } from 'react'

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

export default function HskFlashcard({ words }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState([])
  const [viewed, setViewed] = useState([])

  if (!words || words.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <div className="text-5xl mb-3">🎴</div>
        <p className="text-gray-500">Chưa có từ vựng. Admin cần thêm từ vựng cho bài này để học Flashcard.</p>
      </div>
    )
  }

  const total = words.length
  const card = words[index]
  const isKnown = known.includes(index)

  function flipCard() {
    setFlipped((f) => !f)
    if (!viewed.includes(index)) setViewed((v) => [...v, index])
  }

  function next() {
    setFlipped(false)
    setIndex((i) => (i + 1) % total)
  }

  function prev() {
    setFlipped(false)
    setIndex((i) => (i - 1 + total) % total)
  }

  function toggleKnown() {
    if (isKnown) {
      setKnown((k) => k.filter((x) => x !== index))
    } else {
      setKnown((k) => [...k, index])
      if (!viewed.includes(index)) setViewed((v) => [...v, index])
    }
  }

  function reset() {
    setIndex(0)
    setFlipped(false)
    setKnown([])
    setViewed([])
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tieu de */}
      <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-4 text-center justify-center">
        <span>🎴</span> Flashcard — Lật thẻ để học từ vựng
      </h2>

      {/* Thanh tien do */}
      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
        <span>Thẻ {index + 1} / {total}</span>
        <div className="flex gap-4">
          <span>👁 Đã xem: {viewed.length}</span>
          <span>✅ Đã thuộc: {known.length} / {total}</span>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-blue-500 transition-all rounded-full" style={{ width: `${(viewed.length / total) * 100}%` }} />
      </div>

      {/* The flashcard */}
      <div
        onClick={flipCard}
        className={`relative cursor-pointer rounded-3xl shadow-lg border-2 h-72 flex flex-col items-center justify-center text-center px-8 select-none transition-all ${
          flipped ? 'bg-blue-50 border-blue-300' : 'bg-white border-blue-200'
        }`}
      >
        {!flipped ? (
          <>
            <div className="hanzi text-7xl font-bold text-gray-800">{card.hanzi}</div>
            <p className="mt-6 text-xs text-gray-400">👆 Nhấn vào thẻ để xem nghĩa</p>
          </>
        ) : (
          <>
            <div className="hanzi text-4xl font-bold text-gray-700 mb-2">{card.hanzi}</div>
            <div className="text-2xl text-blue-600 font-semibold italic">{card.pinyin || '—'}</div>
            {card.word_type && <div className="text-sm text-gray-400 mt-1">{card.word_type}</div>}
            <div className="text-xl text-gray-700 mt-2">{card.meaning || '—'}</div>
            {card.example && (
              <div className="mt-3 bg-white rounded-lg px-3 py-1.5 border border-gray-200">
                <span className="hanzi text-sm text-gray-600">{card.example}</span>
              </div>
            )}
          </>
        )}

        {/* Nut loa */}
        <button
          onClick={(e) => { e.stopPropagation(); speak(card.hanzi) }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-xl hover:bg-blue-50 border border-gray-200"
          title="Nghe phát âm"
        >
          🔊
        </button>

        {/* Badge da thuoc */}
        {isKnown && (
          <span className="absolute top-4 left-4 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">✅ Đã thuộc</span>
        )}
      </div>

      {/* Nut dieu khien */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button onClick={prev}
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 border border-gray-200">← Trước</button>
        <button onClick={toggleKnown}
          className={`px-5 py-2.5 rounded-xl font-semibold border ${
            isKnown ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
          }`}>
          {isKnown ? '✅ Đã thuộc' : 'Đánh dấu thuộc'}
        </button>
        <button onClick={next}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">Tiếp →</button>
      </div>

      {/* Nut hoc lai */}
      <div className="text-center mt-4">
        <button onClick={reset} className="text-sm text-gray-400 hover:text-blue-600">🔄 Học lại từ đầu</button>
      </div>

      {/* Thong bao hoan thanh */}
      {viewed.length === total && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-semibold">🎉 Bạn đã xem hết {total} thẻ! Đã thuộc {known.length}/{total} từ.</p>
          <p className="text-sm text-green-600 mt-1">Hãy quay lại học những từ chưa thuộc hoặc chuyển sang phần Luyện tập.</p>
        </div>
      )}

      {/* Luoi the nho phia duoi */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Tổng quan các thẻ:</h3>
        <div className="flex flex-wrap gap-1.5">
          {words.map((w, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setFlipped(false) }}
              className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all ${
                i === index ? 'bg-blue-600 text-white border-blue-600 scale-110' :
                known.includes(i) ? 'bg-green-100 text-green-700 border-green-300' :
                viewed.includes(i) ? 'bg-blue-50 text-blue-600 border-blue-200' :
                'bg-white text-gray-400 border-gray-200'
              }`}
              title={w.hanzi}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-600"></span> Đang xem</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-300"></span> Đã thuộc</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></span> Đã xem</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-gray-200"></span> Chưa xem</span>
        </div>
      </div>
    </div>
  )
}