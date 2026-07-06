import { supabase, isSupabaseReady } from '../lib/supabaseClient.js'

// 3 tai khoan co san (dung khi CHUA cau hinh Supabase de test ngay)
const FALLBACK_ACCOUNTS = [
  { id: 'local-1', username: 'NgoXuanKien22263', password: '096666', full_name: 'Ngo Xuan Kien', role: 'admin', plan: 'vip', status: 'active', is_unlimited: true, expire_date: null },
  { id: 'local-2', username: 'Kngo22263@gmail', password: 'kien1234@', full_name: 'Admin Kien', role: 'admin', plan: 'vip', status: 'active', is_unlimited: true, expire_date: null },
  { id: 'local-3', username: 'hocthuzhongwenxuexi', password: '12356789', full_name: 'Hoc Vien Demo', role: 'student', plan: 'normal', status: 'active', is_unlimited: true, expire_date: null }
]

/**
 * Dang nhap: kiem tra username + password + role.
 * @returns tai khoan neu dung, nem loi neu sai.
 */
export async function loginUser(username, password, role) {
  // ===== Truong hop 1: CHUA co Supabase -> dung tai khoan san =====
  if (!isSupabaseReady) {
    const acc = FALLBACK_ACCOUNTS.find(
      (a) => a.username === username && a.password === password
    )
    if (!acc) throw new Error('Sai tên đăng nhập hoặc mật khẩu.')
    if (acc.role !== role) {
      throw new Error(
        role === 'admin'
          ? 'Tài khoản này không phải Admin. Vui lòng chọn vai trò "Người dùng".'
          : 'Đây là tài khoản Admin. Vui lòng chọn vai trò "Admin".'
      )
    }
    return { ...acc }
  }

  // ===== Truong hop 2: CO Supabase -> kiem tra trong database =====
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (error) throw new Error('Lỗi kết nối cơ sở dữ liệu: ' + error.message)
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
}