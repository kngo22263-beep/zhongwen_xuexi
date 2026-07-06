import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-4">🧭</div>
          <h1 className="text-6xl font-extrabold text-brand-500">404</h1>
          <p className="mt-3 text-lg text-gray-600 font-semibold">
            Không tìm thấy trang bạn yêu cầu
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Trang có thể đã bị xóa hoặc địa chỉ không đúng.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-card"
          >
            ← Về trang chủ
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}