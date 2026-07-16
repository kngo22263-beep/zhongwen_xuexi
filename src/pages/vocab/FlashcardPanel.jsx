import { useState, useEffect } from 'react'
import { recordFlashcard } from '../../services/studyService.js'

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 0.9
  window.speechSynthesis.speak(u)
}

export default function FlashcardPanel({ lessonId, words }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState([])
  const [viewed, setViewed] = useState([])

  // Ghi nhan so flashcard da xem + da thuoc moi khi thay doi
  useEffect(() => {
    if (lessonId && viewed.length > 0) {
      recordFlashcard(lessonId, viewed.length, known.length)
    }
  }, [lessonId, viewed.length, known.length])

  if (!words || words.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-brand-100">
        <div className="text-5xl mb-3">🎴</div>
        <p className="text-gray-500">Chưa có từ vựng. Hãy thêm từ ở tab "Từ vựng" để học Flashcard!</p>
      </div>
    )
  }

  const total = words.length
  const card = words[index]

  function flipCard() {
    setFlipped((f) => !f)
    // Ghi nhan the nay da duoc xem
    if (!viewed.includes(card.id)) {
      setViewed((v) => [...v, card.id])
    }
  }

  function next() {
    setFlipped(false)
    const nextIndex = (index + 1) % total
    setIndex(nextIndex)
  }

  function prev() {
    setFlipped(false)
    setIndex((i) => (i - 1 + total) % total)
  }

  function toggleKnown() {
    if (known.includes(card.id)) {
      setKnown((k) => k.filter((x) => x !== card.id))
    } else {
      setKnown((k) => [...k, card.id])
      // Khi danh dau thuoc cung tinh la da xem
      if (!viewed.includes(card.id)) {
        setViewed((v) => [...v, card.id])
      }
    }
  }

  function reset() {
    setIndex(0)
    setFlipped(false)
    setKnown([])
    setViewed([])
  }

  const isKnown = known.includes(card.id)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Thanh tien do */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <span>Thẻ {index + 1} / {total}</span>
        <div className="flex gap-4">
          <span>👁 Đã xem: {viewed.length}</span>
          <span>✅ Đã thuộc: {known.length} / {total}</span>
        </div>
      </div>
      <div className="w-full h-2 bg-brand-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-brand-500 transition-all" style={{ width: `${(viewed.length / total) * 100}%` }} />
      </div>

      {/* The flashcard */}
      <div
        onClick={flipCard}
        className={`relative cursor-pointer rounded-3xl shadow-card border-2 h-72 flex flex-col items-center justify-center text-center px-6 select-none transition-all ${
          flipped ? 'bg-brand-50 border-brand-300' : 'bg-white border-brand-200'
        }`}
      >
        {!flipped ? (
          <>
            <div className="hanzi text-7xl font-bold text-gray-800">{card.hanzi}</div>
            <p className="mt-6 text-xs text-gray-400">👆 Nhấn vào thẻ để xem nghĩa</p>
          </>
        ) : (
          <>
            <div className="hanzi text-4xl font-bold text-gray-700 mb-3">{card.hanzi}</div>
            <div className="text-2xl text-purple-600 font-semibold italic">{card.pinyin || '—'}</div>
            <div className="text-xl text-gray-700 mt-2">{card.meaning || '—'}</div>
            {card.example && <div className="hanzi text-sm text-gray-400 mt-3">{card.example}</div>}
          </>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); speak(card.hanzi) }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-xl hover:bg-brand-50"
          title="Đọc phát âm"
        >
          🔊
        </button>

        {isKnown && (
          <span className="absolute top-4 left-4 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">✅ Đã thuộc</span>
        )}
      </div>

      {/* Nut dieu khien */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button onClick={prev}
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700">← Trước</button>
        <button onClick={toggleKnown}
          className={`px-5 py-2.5 rounded-xl font-semibold ${isKnown ? 'bg-green-500 text-white' : 'bg-brand-100 text-brand-700'}`}>
          {isKnown ? '✅ Đã thuộc' : 'Đánh dấu thuộc'}
        </button>
        <button onClick={next}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold">Tiếp →</button>
      </div>

      <div className="text-center mt-4">
        <button onClick={reset} className="text-sm text-gray-400 hover:text-brand-500">🔄 Học lại từ đầu</button>
      </div>

      {/* Thong bao khi hoc xong */}
      {viewed.length === total && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-semibold">🎉 Bạn đã xem hết {total} thẻ! Đã thuộc {known.length}/{total} từ.</p>
          <p className="text-sm text-green-600 mt-1">Vào <b>Đánh giá học tập</b> để AI đánh giá kết quả hôm nay.</p>
        </div>
      )}
    </div>
  )
}