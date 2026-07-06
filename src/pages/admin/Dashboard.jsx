import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsers } from '../../services/userService.js'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, admins: 0, students: 0, active: 0 })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const users = await getUsers()
        if (!mounted) return
        setStats({
          total: users.length,
          admins: users.filter((u) => u.role === 'admin').length,
          students: users.filter((u) => u.role === 'student').length,
          active: users.filter((u) => u.status === 'active').length
        })
      } catch {
        // Neu chua co Supabase -> giu so 0
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const cards = [
    { label: 'Tổng tài khoản', value: stats.total, icon: '👥', color: 'from-brand-400 to-brand-500' },
    { label: 'Quản trị viên', value: stats.admins, icon: '👑', color: 'from-purple-400 to-purple-500' },
    { label: 'Học viên', value: stats.students, icon: '🎓', color: 'from-blue-400 to-blue-500' },
    { label: 'Đang hoạt động', value: stats.active, icon: '✅', color: 'from-green-400 to-green-500' }
  ]

  const quick = [
    { to: '/admin/create', label: 'Tạo tài khoản mới', icon: '➕' },
    { to: '/admin/renew', label: 'Gia hạn tài khoản', icon: '📅' },
    { to: '/admin/import/ebook', label: 'Nhập Ebook', icon: '📚' },
    { to: '/admin/import/vocab', label: 'Nhập từ vựng', icon: '🔤' }
  ]

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Dashboard Overview</h1>
      <p className="text-sm text-gray-500 mb-6">Tổng quan hệ thống Zhongwen_xuexi</p>

      {/* The thong ke */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-card border border-brand-100">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xl mb-3`}>
              {c.icon}
            </div>
            <div className="text-3xl font-extrabold text-gray-800">{c.value}</div>
            <div className="text-sm text-gray-500">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Truy cap nhanh */}
      <h2 className="font-bold text-gray-800 mb-3">Truy cập nhanh</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quick.map((q) => (
          <Link key={q.to} to={q.to}
            className="bg-white rounded-2xl p-6 shadow-card border border-brand-100 text-center hover:-translate-y-1 transition-transform">
            <div className="text-3xl mb-2">{q.icon}</div>
            <div className="text-sm font-semibold text-gray-700">{q.label}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}