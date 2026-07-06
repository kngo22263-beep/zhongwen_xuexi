import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function LoginModal({ onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') // 'admin' hoac 'student'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ Gmail/tên đăng nhập và mật khẩu.')
      return
    }

    setLoading(true)
    try {
      const account = await login(username.trim(), password, role)
      onClose?.()
      // Dang nhap admin -> vao trang admin; nguoi dung -> ve trang chu
      if (account.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="Đăng nhập vào Zhongwen_xuexi" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Gmail / ten dang nhap */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Gmail</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="nhập gmail của bạn..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
          />
        </div>

        {/* Mat khau */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="nhập mật khẩu của bạn..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
          />
        </div>

        {/* Thong bao loi */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Nut dang nhap */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-card disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? 'Đang đăng nhập...' : '🔑 Đăng nhập'}
        </button>

        {/* Chon vai tro */}
        <div className="flex items-center justify-center gap-6 pt-1">
          <span className="text-sm text-gray-500">Chọn vai trò:</span>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="role"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
              className="accent-brand-500"
            />
            Admin
          </label>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="role"
              checked={role === 'student'}
              onChange={() => setRole('student')}
              className="accent-brand-500"
            />
            Người dùng
          </label>
        </div>

        {/* Ghi chu: khong cho tu dang ky */}
        <p className="text-center text-xs text-gray-400">
          Tài khoản do quản trị viên cấp. Vui lòng liên hệ admin để được tạo tài khoản.
        </p>
      </form>
    </Modal>
  )
}