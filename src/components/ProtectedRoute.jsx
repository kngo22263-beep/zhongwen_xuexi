import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import LoginModal from './LoginModal.jsx'

/**
 * Bao ve mot trang.
 * Props:
 *  - children: noi dung trang can bao ve
 *  - requireAdmin: neu true thi chi admin moi vao duoc
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, isAdmin, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  // Dang tai thong tin dang nhap
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Đang tải...
      </div>
    )
  }

  // Chua dang nhap -> chan lai + moi dang nhap
  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-card p-8 border border-brand-100">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">
            Chức năng dành cho thành viên
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Đây là dịch vụ có phí. Vui lòng đăng nhập bằng tài khoản được cấp để sử dụng.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-card"
          >
            👤 Đăng nhập ngay
          </button>
          <div className="mt-4">
            <Link to="/" className="text-sm text-gray-400 hover:text-brand-500">
              ← Về trang chủ
            </Link>
          </div>
        </div>

        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    )
  }

  // Da dang nhap nhung khong phai admin ma trang yeu cau admin -> chan
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-card p-8 border border-brand-100">
          <div className="text-5xl mb-4">⛔</div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Khu vực này chỉ dành cho quản trị viên (Admin).
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-card inline-block"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  // Du dieu kien -> cho hien noi dung trang
  return children
}