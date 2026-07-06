import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../../services/userService.js'
import { addMonths, todayStr } from '../../utils/dateUtils.js'

export default function CreateAccount() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('student') // 'admin' | 'student'
  const [isUnlimited, setIsUnlimited] = useState(true)
  const [startDate, setStartDate] = useState(todayStr())
  const [expireDate, setExpireDate] = useState(addMonths(todayStr(), 1))

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setError('')
    setSuccess('')
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.')
      return
    }
    setLoading(true)
    try {
      await createUser({
        username: username.trim(),
        password: password.trim(),
        fullName: fullName.trim() || username.trim(),
        role,
        plan: role === 'admin' ? 'vip' : 'vip',
        isUnlimited,
        startDate: isUnlimited ? null : startDate,
        expireDate: isUnlimited ? null : expireDate
      })
      setSuccess(`Đã tạo tài khoản "${username}" thành công!`)
      setUsername(''); setPassword(''); setFullName('')
    } catch (err) {
      setError(err.message || 'Không tạo được tài khoản.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">TẠO TÀI KHOẢN NGƯỜI DÙNG MỚI</h1>
      <p className="text-sm text-gray-500 mb-6">Thêm mới tài khoản vào hệ thống</p>

      <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-6 space-y-5">
        <h2 className="font-bold text-gray-800">Thông tin cơ bản</h2>

        {/* Ten dang nhap */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tên đăng nhập</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)}
            placeholder="👤 Nhập tên đăng nhập (gmail hoặc tên)..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
        </div>

        {/* Mat khau */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="🔒 Nhập mật khẩu..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
        </div>

        {/* Ho ten */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên (tùy chọn)</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ tên hiển thị..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
        </div>

        {/* Chon chuc nang */}
        <div>
          <h2 className="font-bold text-gray-800 mb-1">Chọn chức năng</h2>
          <p className="text-xs text-gray-400 mb-3">Vui lòng chọn chức năng cho tài khoản</p>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setRole('admin')}
              className={`rounded-xl border-2 p-4 text-center ${role === 'admin' ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}>
              <div className="text-2xl mb-1">👑</div>
              <div className="font-bold text-gray-800">Quản trị viên</div>
              <div className="text-xs text-gray-400">Có quyền quản lý hệ thống và toàn bộ dữ liệu</div>
            </button>
            <button onClick={() => setRole('student')}
              className={`rounded-xl border-2 p-4 text-center ${role === 'student' ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}>
              <div className="text-2xl mb-1">🎓</div>
              <div className="font-bold text-gray-800">Học viên</div>
              <div className="text-xs text-gray-400">Truy cập và sử dụng các tính năng học tập</div>
            </button>
          </div>
        </div>

        {/* Goi han */}
        <div>
          <h2 className="font-bold text-gray-800 mb-2">Thời hạn tài khoản</h2>
          <label className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
            <input type="radio" checked={isUnlimited} onChange={() => setIsUnlimited(true)} className="accent-brand-500" />
            Vô hạn (không giới hạn thời gian)
          </label>
          <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer">
            <input type="radio" checked={!isUnlimited} onChange={() => setIsUnlimited(false)} className="accent-brand-500" />
            Gia hạn theo thời gian
          </label>
          {!isUnlimited && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ngày đăng ký</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ngày hết hạn</label>
                <input type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200" />
              </div>
            </div>
          )}
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
        {success && <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">{success}</div>}

        {/* Nut */}
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => navigate('/admin/users/all')}
            className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700">
            Quay lại
          </button>
          <button onClick={handleCreate} disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold disabled:opacity-60">
            {loading ? 'Đang tạo...' : '+ Tạo Tài khoản Mới'}
          </button>
        </div>
      </div>
    </div>
  )
}