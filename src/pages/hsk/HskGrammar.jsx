export default function HskGrammar({ grammar }) {
  if (!grammar || grammar.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <div className="text-5xl mb-3">📐</div>
        <p className="text-gray-500">Chưa có ngữ pháp. Admin cần thêm ngữ pháp cho bài này.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
        <span>📐</span> Ngữ pháp bài học
      </h2>

      <div className="space-y-4">
        {grammar.map((g, i) => (
          <div key={g.id || i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Tieu de ngu phap */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">{i + 1}</span>
                <h3 className="text-white font-bold text-lg">{g.title || `Ngữ pháp ${i + 1}`}</h3>
              </div>
            </div>

            {/* Noi dung ngu phap */}
            <div className="p-5 space-y-4">
              {/* Giai thich */}
              {g.content && (
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{g.content}</div>
              )}

              {/* Cong thuc (neu co) */}
              {g.formula && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="text-xs font-semibold text-blue-600 mb-1">📌 Công thức:</div>
                  <div className="hanzi text-lg font-bold text-blue-800">{g.formula}</div>
                </div>
              )}

              {/* Vi du */}
              {g.examples && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-xs font-semibold text-gray-600 mb-2">💡 Ví dụ:</div>
                  <div className="space-y-2">
                    {g.examples.split('\n').filter(Boolean).map((ex, j) => {
                      // Tach vi du thanh: Han tu | Pinyin | Nghia (neu co)
                      const parts = ex.split(' - ').map((p) => p.trim())
                      return (
                        <div key={j} className="flex flex-wrap items-baseline gap-2 py-1 border-b border-gray-100 last:border-0">
                          <span className="hanzi text-base font-semibold text-gray-800">{parts[0]}</span>
                          {parts[1] && <span className="text-sm text-blue-600 italic">{parts[1]}</span>}
                          {parts[2] && <span className="text-sm text-gray-500">→ {parts[2]}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Luu y (neu co) */}
              {g.note && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <div className="flex items-start gap-2 text-sm text-yellow-800">
                    <span>⚠️</span>
                    <div className="whitespace-pre-line">{g.note}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Meo hoc */}
      <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-100">
        <div className="flex items-start gap-2 text-sm text-green-800">
          <span>💡</span>
          <div>
            <b>Mẹo học ngữ pháp:</b> Hãy đặt câu ví dụ riêng cho mỗi cấu trúc ngữ pháp. Việc tự đặt câu giúp bạn
            ghi nhớ sâu hơn so với chỉ đọc ví dụ có sẵn.
          </div>
        </div>
      </div>
    </div>
  )
}