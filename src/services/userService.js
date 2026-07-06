import { supabase, isSupabaseReady } from '../lib/supabaseClient.js'

// Bao loi ro rang khi chua cau hinh Supabase
function needSupabase() {
  throw new Error(
    'Chức năng này cần Supabase. Hãy điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env rồi tải lại trang.'
  )
}

/** Lay danh sach tat ca tai khoan */
export async function getUsers() {
  if (!isSupabaseReady) return []
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return data || []
}

/** Tao tai khoan moi */
export async function createUser({ username, password, fullName, role, plan, isUnlimited, startDate, expireDate }) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('users').insert({
    username,
    password,
    full_name: fullName,
    role: role || 'student',
    plan: plan || 'normal',
    status: 'active',
    is_unlimited: !!isUnlimited,
    start_date: startDate || null,
    expire_date: expireDate || null
  })
  if (error) {
    if (error.code === '23505') throw new Error('Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.')
    throw new Error(error.message)
  }
  return true
}

/** Xoa tai khoan */
export async function deleteUser(id) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

/** Doi vai tro (admin / student) */
export async function setUserRole(id, role) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('users').update({ role }).eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

/** Doi goi cuoc (vip / normal) */
export async function setUserPlan(id, plan) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('users').update({ plan }).eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

/** Khoa / mo khoa tai khoan (active / locked) */
export async function setUserStatus(id, status) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('users').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

/** Gia han tai khoan */
export async function renewUser(id, { isUnlimited, startDate, expireDate }) {
  if (!isSupabaseReady) needSupabase()
  const { error } = await supabase.from('users').update({
    is_unlimited: !!isUnlimited,
    start_date: startDate || null,
    expire_date: expireDate || null,
    plan: 'vip' // gia han la nang len vip
  }).eq('id', id)
  if (error) throw new Error(error.message)
  return true
}