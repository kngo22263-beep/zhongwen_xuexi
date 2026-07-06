import { useEffect, useState } from 'react'
import Loader from '../../components/Loader.jsx'
import { getUsers, renewUser } from '../../services/userService.js'
import { formatDate, isExpired, todayStr, addMonths, toVNDate, fromVNDate } from '../../utils/dateUtils.js'

export default function RenewAccount() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const [mode, setMode] = useState('unlimited')
  const [startDate, setStartDate] = useState('')   // dd/mm/yyyy
  const [expireDate, setExpireDate] = useState('') // dd/mm/yyyy
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function load() {
    setLoading(true)
    try { setUsers(await getUsers() || []) } catch { setUsers([]) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  function pick(u) {
    setErr('')
    setSelected(u)
    setMode(u.is_unlimited ? 'unlimited' : 'period')
    setStartDate(toVNDate(u.start_date) || toVNDate(todayStr()))
    setExpireDate(toVNDate(u.expire_date) || toVNDate(addMonths(todayStr(), 1)))
  }

  async function handleSave() {
    setErr('')
    if (!selected) return

    let startIso = null
    let expireIso = null

    if (mode === 'period') {
      startIso = fromVNDate(startDate)
      expireIso = fromVNDate(expireDate)
      if (!startIso) { setErr('Ngày đăng ký sai. Nhập theo dạng dd/mm/yyyy (VD: 03/08/2026)'); return }
      if (!expireIso) { setErr('Ngày hết hạn sai. Nhập theo dạng dd/mm/yyyy (VD: 03/08/2026)'); return }
      if (new Date(expireIso) < new Date(startIso)) { setErr('Ngày hết hạn phải sau ngày đăng ký.'); return }
    }

    setSaving(true)
    try {
      await renewUser(selected.id, {
        isUnlimited: mode === 'unlimited',
        startDate: mode === 'unlimited' ? null : startIso,
        expireDate: mode === 'unlimited' ? null : expireIso
      })
      setSelected(null)
      load()
    } catch (e) {
      setErr('Lỗi: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">DANH SÁCH TÀI KHOẢN</h1>
      <p className="text-sm text-gray-500 mb-5">Chọn tài khoản để gia hạn</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-brand-100 overflow-hidden">
          {loading ? <Loader text="Đang tải..." /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">STT</th>
                    <th className="text-left px-4 py-3">Họ và tên</th>
                    <th className="text-left px-4 py-3">Ngày hết hạn</th>
                    <th className="text-left px-4 py-3">Trạng thái</th>
                    <th className="text-left px-4 py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u, i) => {
                    const expired = u.expire_date && isExpired(u.expire_date) && !u.is_unlimited
                    return (
                      <tr key={u.id} className={`hover:bg-brand-50/40 ${selected?.id === u.id ? 'bg-brand-50' : ''}`}>
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800">{u.full_name || u.username}</div>
                          <div className="text-xs text-gray-400">{u.username}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{u.is_unlimited ? 'Vô hạn' : formatDate(u.expire_date)}</td>
                        <td className="px-4 py-3">
                          {expired ? <span className="text-red-500 font-semibold">Hết hạn</span>
                            : <span className="text-green-600 font-semibold">Còn hạn</span>}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => pick(u)} className="text-brand-600 hover:underline text-xs font-semibold">✏️ Gia hạn</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-brand-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Gia hạn tài khoản</h3>
            {selected && <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>}
          </div>

          {!selected ? (
            <p className="text-sm text-gray-400 text-center py-8">Chọn một tài khoản ở bảng để gia hạn.</p>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <span className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">👤</span>
                <div>
                  <div className="font-semibold text-gray-800">{selected.full_name || selected.username}</div>
                  <div className="text-xs text-gray-400">{selected.username}</div>
                </div>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">Tùy chọn gói hạn</label>
              <label className="flex items-start gap-2 text-sm mb-3 cursor-pointer">
                <input type="radio" checked={mode === 'unlimited'} onChange={() => setMode('unlimited')} className="mt-1 accent-brand-500" />
                <div>
                  <div className="font-semibold">Vô hạn</div>
                  <div className="text-xs text-gray-400">Tài khoản sử dụng không giới hạn thời gian.</div>
                </div>
              </label>
              <label className="flex items-start gap-2 text-sm mb-4 cursor-pointer">
                <input type="radio" checked={mode === 'period'} onChange={() => setMode('period')} className="mt-1 accent-brand-500" />
                <div>
                  <div className="font-semibold">Gia hạn theo thời gian</div>
                  <div className="text-xs text-gray-400">Nhập ngày theo dạng ngày/tháng/năm.</div>
                </div>
              </label>

              {mode === 'period' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Ngày đăng ký (dd/mm/yyyy)</label>
                    <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                      placeholder="VD: 03/07/2026"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Ngày hết hạn (dd/mm/yyyy)</label>
                    <input type="text" value={expireDate} onChange={(e) => setExpireDate(e.target.value)}
                      placeholder="VD: 03/08/2026"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200" />
                  </div>
                </div>
              )}

              {err && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">{err}</div>}

              <div className="flex gap-2">
                <button onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700">Hủy</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold disabled:opacity-60">
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}