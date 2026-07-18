import { useState } from 'react'

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 0.8
  window.speechSynthesis.speak(u)
}

export default function HskText({ texts }) {
  const [activeText, setActiveText] = useState(0)
  const [showPinyin, setShowPinyin] = useState(true)
  const [showHanzi, setShowHanzi] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)

  if (!texts || texts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <div className="text-5xl mb-3">📖</div>
        <p className="text-gray-500">Chưa có bài khóa. Admin cần thêm bài khóa cho bài này.</p>
      </div>
    )
  }

  const text = texts[activeText] || texts[0]

  // Tach bai khoa thanh cac dong (theo vai A:, B:, hoac xuong dong)
  function parseLines(content) {
    if (!content) return []
    return content.split('\n').map((line) => line.trim()).filter(Boolean)
  }

  function parsePinyinLines(pinyin) {
    if (!pinyin) return []
    return pinyin.split('\n').map((line) => line.trim()).filter(Boolean)
  }

  const contentLines = parseLines(text.content)
  const pinyinLines = parsePinyinLines(text.pinyin)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Cot trai: noi dung bai khoa */}
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 font-bold text-gray-800">
            <span>📖</span> {text.title || `课文${activeText + 1}`}:
          </h2>
        </div>

        {/* Nut dieu khien hien thi */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              showPinyin ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            A Pinyin
          </button>
          <button
            onClick={() => setShowHanzi(!showHanzi)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              showHanzi ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            字 chữ Hán
          </button>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              showTranslation ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            🔄 Dịch nghĩa
          </button>
          <button
            onClick={() => speak(text.content || '')}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-700 hover:bg-green-200"
          >
            🔊 Nghe toàn bài
          </button>
        </div>

        {/* Noi dung bai khoa */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          {contentLines.map((line, i) => {
            // Kiem tra xem dong co bat dau bang A: B: C: khong
            const speakerMatch = line.match(/^([A-Z]):?\s*(.*)/)
            const speaker = speakerMatch ? speakerMatch[1] : null
            const lineContent = speakerMatch ? speakerMatch[2] : line
            const pinyinLine = pinyinLines[i] || ''

            return (
              <div key={i} className="group">
                {/* Ten nguoi noi */}
                {speaker && (
                  <div className="text-sm font-bold text-blue-600 mb-1">{speaker}:</div>
                )}

                {/* Pinyin */}
                {showPinyin && pinyinLine && (
                  <div className="text-sm text-gray-500 italic mb-0.5">
                    {speakerMatch ? pinyinLine.replace(/^[A-Z]:?\s*/, '') : pinyinLine}
                  </div>
                )}

                {/* Han tu */}
                {showHanzi && (
                  <div className="flex items-center gap-2">
                    <p className="hanzi text-xl font-semibold text-gray-800 leading-relaxed">{lineContent}</p>
                    <button
                      onClick={() => speak(lineContent)}
                      className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-opacity shrink-0"
                      title="Nghe câu này"
                    >
                      🔊
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Dich nghia */}
          {showTranslation && text.translation && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="text-sm font-semibold text-gray-500 mb-2">── Dịch nghĩa ──</div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{text.translation}</div>
            </div>
          )}
        </div>
      </div>

      {/* Cot phai: muc luc bai khoa */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-20">
          <h3 className="font-bold text-gray-800 mb-3">📋 Nội dung bài học</h3>
          <div className="space-y-2">
            {texts.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveText(i)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  activeText === i
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeText === i ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-500'
                }`}>{i + 1}</span>
                {t.title || `课文${i + 1}`}:
              </button>
            ))}
          </div>

          <div className="mt-4 bg-yellow-50 rounded-xl p-3 border border-yellow-100">
            <div className="flex items-start gap-2 text-xs text-yellow-800">
              <span>💡</span>
              <span><b>Mẹo học hiệu quả:</b><br/>Nghe và nhắc lại theo từng câu để cải thiện phát âm và ghi nhớ hiệu quả hơn.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}