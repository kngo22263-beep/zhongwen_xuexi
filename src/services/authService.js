import { supabase, isSupabaseReady } from '../lib/supabaseClient.js'

// 3 tai khoan co san (dung khi Supabase loi hoac chua cau hinh)
const FALLBACK_ACCOUNTS = [
  { id: 'local-1', username: 'NgoXuanKien22263', password: '096666', full_name: 'Ngo Xuan Kien', role: 'admin', plan: 'vip', status: 'active', is_unlimited: true, expire_date: null },
  { id: 'local-2', username: 'Kngo22263@gmail', password: 'kien1234@', full_name: 'Admin Kien', role: 'admin', plan: 'vip', status: 'active', is_unlimited: true, expire_date: null },
  { id: 'local-3', username: 'hocthuzhongwenxuexi', password: '12356789', full_name: 'Hoc Vien Demo', role: 'student', plan: 'normal', status: 'active', is_unlimited: true, expire_date: null }
]

// Kiem tra dang nhap bang tai khoan san
function loginFallback(username, password, role) {
  const acc = FALLBACK_ACCOUNTS.find(
    (a) => a.username === username && a.password === password
  )
  if (!acc) return null
  if (acc.role !== role) {
    throw new Error(
      role === 'admin'
        ? 'Tài khoản này không phải Admin. Vui lòng chọn vai trò "Người dùng".'
        : 'Đây là tài khoản Admin. Vui lòng chọn vai trò "Admin".'
    )
  }
  return { ...acc }
}

export async function loginUser(username, password, role) {
  // Luon kiem tra tai khoan san TRUOC
  const fallback = loginFallback(username, password, role)
  if (fallback) return fallback

  // Neu co Supabase thi kiem tra them trong database
  if (isSupabaseReady) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .maybeSingle()

      if (error) throw new Error(error.message)
      if (!data) throw new Error('Sai tên đăng nhập hoặc mật khẩu.')
      if (data.password !== password) throw new Error('Sai tên đăng nhập hoặc mật khẩu.')
      if (data.status === 'locked') throw new Error('Tài khoản đã bị khóa. Vui lòng liên hệ admin.')
      if (data.role !== role) {
        throw new Error(
          role === 'admin'
            ? 'Tài khoản này không phải Admin. Vui lòng chọn vai trò "Người dùng".'
            : 'Đây là tài khoản Admin. Vui lòng chọn vai trò "Admin".'
        )
      }
      return data
    } catch (err) {
      // Neu loi ket noi Supabase -> bao loi ro rang
      if (err.message.includes('fetch') || err.message.includes('network')) {
        throw new Error('Sai tên đăng nhập hoặc mật khẩu.')
      }
      throw err
    }
  }

  // Khong co Supabase va khong khop tai khoan san
  throw new Error('Sai tên đăng nhập hoặc mật khẩu.')
}