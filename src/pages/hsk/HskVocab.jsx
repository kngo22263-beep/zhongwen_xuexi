// Tab Tu vung - hien bang tu vung voi loa doc phat am

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

export default function HskVocab({ words }) {
  if (!words || words.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <div className="text-5xl mb-3">📝</div>
        <p className="text-gray-500">Chưa có từ vựng. Admin cần thêm từ vựng cho bài này.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 font-bold text-gray-800">
          <span>📋</span> Danh sách từ vựng
        </h2>
        <span className="text-sm text-gray-400">{words.length} từ</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header bang */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-semibold">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Hán tự</div>
          <div className="col-span-2">Pinyin</div>
          <div className="col-span-2">Từ loại</div>
          <div className="col-span-4">Nghĩa</div>
          <div className="col-span-1 text-center">Nghe</div>
        </div>

        {/* Cac dong tu vung */}
        {words.map((w, i) => (
          <div
            key={w.id || i}
            className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-gray-100 hover:bg-blue-50/40 transition-colors ${
              i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
            }`}
          >
            <div className="col-span-1 text-sm text-gray-400">{i + 1}</div>
            <div className="col-span-2 hanzi text-2xl font-bold text-gray-800">{w.hanzi}</div>
            <div className="col-span-2 text-blue-600 italic text-sm">{w.pinyin || '—'}</div>
            <div className="col-span-2 text-gray-500 text-sm">{w.word_type || ''}</div>
            <div className="col-span-4 text-gray-700 text-sm">{w.meaning || '—'}</div>
            <div className="col-span-1 text-center">
              <button
                onClick={() => speak(w.hanzi)}
                className="w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-colors mx-auto"
                title="Nghe phát âm"
              >
                🔊
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vi du (neu co) */}
      {words.some((w) => w.example) && (
        <div className="mt-6">
          <h3 className="font-bold text-gray-800 mb-3">📌 Ví dụ</h3>
          <div className="space-y-2">
            {words.filter((w) => w.example).map((w, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-gray-200 flex items-center gap-3">
                <span className="hanzi text-lg font-bold text-gray-800">{w.hanzi}</span>
                <span className="text-gray-400">→</span>
                <span className="hanzi text-gray-700">{w.example}</span>
                <button onClick={() => speak(w.example)} className="ml-auto text-blue-500 hover:text-blue-700" title="Nghe ví dụ">🔊</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}