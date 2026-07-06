import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import LoginModal from './LoginModal.jsx'

export default function Navbar() {
  const { isLoggedIn, isAdmin, user, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const navigate = useNavigate()

  const menu = [
    { to: '/', label: 'Trang chủ', end: true },
    { to: '/ebook', label: 'Ebook' },
    { to: '/vocabulary', label: 'Từ vựng' },
    { to: '/review', label: 'Ôn tập' }
  ]

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brand-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white text-xl shadow-card">
            📖
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-brand-600 text-lg">Zhongwen_xuexi</div>
            <div className="text-[11px] text-gray-400 hanzi">每天学习，每天进步。</div>
          </div>
        </Link>

        {/* Menu chinh */}
        <nav className="hidden md:flex items-center gap-7">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-brand-600 border-b-2 border-brand-500 pb-1'
                    : 'text-gray-600 hover:text-brand-500'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Ben phai: tim kiem + dang nhap */}
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-full hover:bg-brand-50 flex items-center justify-center text-gray-500"
            title="Tìm kiếm"
          >
            🔍
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:inline text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Trang Admin
            </Link>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-gray-600">
                👤 {user?.full_name || user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-card flex items-center gap-1"
            >
              👤 Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Popup dang nhap */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  )
}