import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  // 4 the chuc nang o duoi banner
  const features = [
    {
      icon: '🏠',
      title: 'Trang chủ',
      desc: 'Cập nhật thông tin mới nhất và các bài học nổi bật.',
      to: '/'
    },
    {
      icon: '📖',
      title: 'Ebook',
      desc: 'Kho ebook phong phú với nhiều chủ đề hấp dẫn.',
      to: '/ebook'
    },
    {
      icon: '🅰️',
      title: 'Từ vựng',
      desc: 'Học từ vựng theo chủ đề, hiệu quả và dễ nhớ.',
      to: '/vocabulary'
    },
    {
      icon: '✅',
      title: 'Ôn tập',
      desc: 'Ôn tập kiến thức với bài tập đa dạng và thú vị.',
      to: '/review'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* ===== BANNER ===== */}
          <section className="rounded-3xl bg-gradient-to-br from-brand-100 to-brand-50 overflow-hidden shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 p-8 md:p-12">
              {/* Ben trai: chu */}
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-brand-600 text-xs font-semibold shadow-soft">
                  ⭐ Học tập thông minh
                </span>
                <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-gray-800">
                  Nền tảng học tập
                  <br />
                  <span className="text-brand-500">hiệu quả</span> cho bạn
                </h1>
                <p className="mt-4 text-gray-500 max-w-md">
                  Khám phá kho tài liệu phong phú, học từ vựng dễ dàng và ôn tập mọi
                  lúc mọi nơi.
                </p>
                <Link
                  to="/vocabulary"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-card"
                >
                  Bắt đầu học ngay →
                </Link>
              </div>

              {/* Ben phai: minh hoa chu Han */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-44 md:w-80 md:h-52 bg-white rounded-2xl shadow-card flex flex-col items-center justify-center border-4 border-gray-100">
                    <span className="hanzi text-6xl md:text-7xl font-bold text-gray-800">
                      中文
                    </span>
                    <span className="hanzi text-sm text-gray-400 mt-2">
                      每天学习，每天进步。
                    </span>
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center text-2xl shadow-card">
                    ☕
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 4 THE CHUC NANG ===== */}
          <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-card border border-brand-100 hover:-translate-y-1 transition-transform"
              >
                <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-2xl mx-auto">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-center font-bold text-gray-800">{f.title}</h3>
                <p className="mt-2 text-center text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
                <div className="mt-4 text-center">
                  <Link
                    to={f.to}
                    className="text-sm font-semibold text-brand-500 hover:text-brand-600"
                  >
                    Khám phá →
                  </Link>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}