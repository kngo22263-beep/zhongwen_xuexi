import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

// Cac muc trong sidebar
const MENU = [
  { to: '/admin', label: 'Dashboard Overview', icon: '🏠', end: true },
  {
    label: 'Quản lý Tài khoản', icon: '👥',
    children: [
      { to: '/admin/users/all', label: 'All Users' },
      { to: '/admin/users/admins', label: 'Admins' },
      { to: '/admin/users/students', label: 'Students' }
    ]
  },
  { to: '/admin/create', label: 'Tạo Tài khoản Mới', icon: '➕' },
  { to: '/admin/renew', label: 'Gia hạn Tài khoản', icon: '📅' },
  {
    label: 'Nhập Dữ liệu', icon: '📤',
    children: [
      { to: '/admin/import/vocab', label: 'Từ vựng' },
      { to: '/admin/import/ebook', label: 'Ebook' },
      { to: '/admin/import/reading', label: 'Bài Đọc' }
    ]
  },
  { to: '/admin/settings', label: 'Cài đặt Hệ thống', icon: '⚙️' }
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [openGroups, setOpenGroups] = useState({ 'Quản lý Tài khoản': true, 'Nhập Dữ liệu': true })

  function toggleGroup(label) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
      {/* Thanh tren cung */}
      <header className="bg-white border-b border-brand-100 shadow-soft">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white text-xl">📖</div>
            <div className="leading-tight">
              <div className="font-extrabold text-brand-600 text-lg">Zhongwen_xuexi</div>
              <div className="text-[11px] text-gray-400 hanzi">每天学习，每天进步。</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-gray-500 hover:text-brand-500">← Về trang web</Link>
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">👤</span>
              <span className="text-sm font-semibold text-gray-700">{user?.full_name || 'Admin'}</span>
            </div>
            <button onClick={handleLogout}
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-white border-r border-brand-100 p-3 hidden md:block">
          <nav className="space-y-1">
            {MENU.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button onClick={() => toggleGroup(item.label)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-brand-50">
                    <span className="flex items-center gap-2">{item.icon} {item.label}</span>
                    <span className="text-xs">{openGroups[item.label] ? '▲' : '▼'}</span>
                  </button>
                  {openGroups[item.label] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((c) => (
                        <NavLink key={c.to} to={c.to}
                          className={({ isActive }) =>
                            `block px-3 py-1.5 rounded-lg text-sm ${
                              isActive ? 'bg-brand-500 text-white font-semibold' : 'text-gray-500 hover:bg-brand-50'
                            }`}>
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
                      isActive ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-brand-50'
                    }`}>
                  {item.icon} {item.label}
                </NavLink>
              )
            )}
          </nav>
        </aside>

        {/* Noi dung trang admin */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}