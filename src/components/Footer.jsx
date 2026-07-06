import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 bg-white border-t border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cot 1: Gioi thieu */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white text-lg">
              📖
            </div>
            <span className="font-extrabold text-brand-600 text-lg">Zhongwen_xuexi</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Nền tảng học tiếng Trung hiệu quả. Học từ vựng, ôn tập và khám phá kho
            Ebook HSK mọi lúc mọi nơi.
          </p>
          <p className="mt-3 text-sm text-brand-500 hanzi">每天学习，每天进步。</p>
        </div>

        {/* Cot 2: Chuc nang */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">Chức năng</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-brand-500">Trang chủ</Link></li>
            <li><Link to="/ebook" className="hover:text-brand-500">Ebook</Link></li>
            <li><Link to="/vocabulary" className="hover:text-brand-500">Từ vựng</Link></li>
            <li><Link to="/review" className="hover:text-brand-500">Ôn tập</Link></li>
          </ul>
        </div>

        {/* Cot 3: Ho tro */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>Hướng dẫn sử dụng</li>
            <li>Câu hỏi thường gặp</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        {/* Cot 4: Lien he */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">Liên hệ</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>📧 kngo22263@gmail.com</li>
            <li>🌐 đăng kí: zalo 0966609687</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-100 py-4 text-center text-xs text-gray-400">
        © {year} Zhongwen_xuexi. Bản quyền thuộc về Ngô Xuân Kiên.
      </div>
    </footer>
  )
}