import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader.jsx'
import {
  getUsers, deleteUser, setUserRole, setUserPlan, setUserStatus
} from '../../services/userService.js'
import { formatDate, isExpired } from '../../utils/dateUtils.js'

export default function UserManagement() {
  const { filter } = useParams() // 'all' | 'admins' | 'students'
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data || [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Loc theo tab
  let list = users
  if (filter === 'admins') list = users.filter((u) => u.role === 'admin')
  if (filter === 'students') list = users.filter((u) => u.role === 'student')
  if (search.trim()) {
    const k = search.toLowerCase()
    list = list.filter((u) =>
      (u.username || '').toLowerCase().includes(k) ||
      (u.full_name || '').toLowerCase().includes(k)
    )
  }

  async function act(fn, ...args) {
    try {
      await fn(...args)
      load()
    } catch (err) {
      alert('Lỗi: ' + err.message)
    }
  }

  const title = filter === 'admins' ? 'Danh sách Admin'
    : filter === 'students' ? 'Danh sách Học viên'
    : 'Quản lý Tài khoản'

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">{title}</h1>
      <p className="text-sm text-gray-500 mb-5">Danh sách tài khoản trong hệ thống</p>

      <div className="bg-white rounded-2xl shadow-card border border-brand-100 overflow-hidden">
        <div className="p-4 border-b border-brand-100">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Tìm theo tên, email..."
            className="w-full md:w-80 px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-500 outline-none"
          />
        </div>

        {loading ? (
          <Loader text="Đang tải danh sách..." />
        ) : list.length === 0 ? (
          <div className="p-10 text-center text-gray-400">Chưa có tài khoản nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Tên người dùng</th>
                  <th className="text-left px-4 py-3">Vai trò</th>
                  <th className="text-left px-4 py-3">Trạng thái</th>
                  <th className="text-left px-4 py-3">Gói cước</th>
                  <th className="text-left px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((u, i) => {
                  const expired = u.expire_date && isExpired(u.expire_date) && !u.is_unlimited
                  return (
                    <tr key={u.id} className="hover:bg-brand-50/40">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{u.full_name || u.username}</div>
                        <div className="text-xs text-gray-400">{u.username}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.status === 'locked' ? (
                          <span className="text-gray-500 font-semibold">Đã khóa</span>
                        ) : expired ? (
                          <span className="text-red-500 font-semibold">Hết hạn</span>
                        ) : (
                          <span className="text-green-600 font-semibold">Hoạt động</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className={`font-semibold ${u.plan === 'vip' ? 'text-brand-600' : 'text-gray-600'}`}>
                          {u.is_unlimited ? 'Không giới hạn' : (u.plan === 'vip' ? 'VIP' : 'Thường')}
                        </div>
                        {!u.is_unlimited && u.expire_date && (
                          <div className="text-xs text-gray-400">Hết hạn: {formatDate(u.expire_date)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {u.plan === 'vip' ? (
                            <button onClick={() => act(setUserPlan, u.id, 'normal')} className="text-gray-600 hover:underline">Hạ Thường</button>
                          ) : (
                            <button onClick={() => act(setUserPlan, u.id, 'vip')} className="text-brand-600 hover:underline">Nâng VIP</button>
                          )}
                          {u.role === 'admin' ? (
                            <button onClick={() => act(setUserRole, u.id, 'student')} className="text-blue-600 hover:underline">Hạ Học viên</button>
                          ) : (
                            <button onClick={() => act(setUserRole, u.id, 'admin')} className="text-purple-600 hover:underline">Nâng Admin</button>
                          )}
                          {u.status === 'locked' ? (
                            <button onClick={() => act(setUserStatus, u.id, 'active')} className="text-green-600 hover:underline">Mở khóa</button>
                          ) : (
                            <button onClick={() => act(setUserStatus, u.id, 'locked')} className="text-orange-600 hover:underline">Khóa</button>
                          )}
                          <button onClick={() => {
                            if (window.confirm(`Xóa tài khoản "${u.username}"?`)) act(deleteUser, u.id)
                          }} className="text-red-600 hover:underline">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}