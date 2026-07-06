import { createClient } from '@supabase/supabase-js'

// Doc thong tin Supabase tu file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Kiem tra da cau hinh Supabase chua
export const isSupabaseReady =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey)

// Tao ket noi toi Supabase (chi tao khi da co URL + key)
export const supabase = isSupabaseReady
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Ham tien ich: bao loi ro rang neu chua cau hinh Supabase
export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Chua cau hinh Supabase. Hay dien VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY vao file .env'
    )
  }
  return supabase
}