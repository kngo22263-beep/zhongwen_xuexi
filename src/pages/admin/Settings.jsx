import { isSupabaseReady } from '../../lib/supabaseClient.js'
import { isAiReady } from '../../lib/aiClient.js'

export default function Settings() {
  const items = [
    {
      label: 'Kết nối Supabase (Database)',
      ok: isSupabaseReady,
      okText: 'Đã kết nối',
      noText: 'Chưa cấu hình — điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env'
    },
    {
      label: 'Kết nối AI Gemini (Tạo đoạn văn)',
      ok: isAiReady,
      okText: 'Đã sẵn sàng',
      noText: 'Chưa có API key — điền VITE_GEMINI_API_KEY vào file .env'
    }
  ]

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Cài đặt Hệ thống</h1>
      <p className="text-sm text-gray-500 mb-6">Kiểm tra trạng thái kết nối và thông tin hệ thống</p>

      <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6 mb-5">
        <h2 className="font-bold text-gray-800 mb-4">Trạng thái kết nối</h2>
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.label} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
              <span className={`mt-0.5 text-lg ${it.ok ? 'text-green-500' : 'text-orange-500'}`}>
                {it.ok ? '✅' : '⚠️'}
              </span>
              <div>
                <div className="font-semibold text-gray-800">{it.label}</div>
                <div className={`text-sm ${it.ok ? 'text-green-600' : 'text-orange-600'}`}>
                  {it.ok ? it.okText : it.noText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6">
        <h2 className="font-bold text-gray-800 mb-4">Thông tin website</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-gray-500">Tên website</div>
          <div className="font-semibold text-gray-800">Zhongwen_xuexi</div>
          <div className="text-gray-500">Phiên bản</div>
          <div className="font-semibold text-gray-800">1.0.0</div>
          <div className="text-gray-500">Model AI</div>
          <div className="font-semibold text-gray-800">gemini-flash-latest</div>
          <div className="text-gray-500">Tác giả</div>
          <div className="font-semibold text-gray-800">Ngô Xuân Kiên</div>
        </div>
      </div>
    </div>
  )
}