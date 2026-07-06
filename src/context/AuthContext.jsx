import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser } from '../services/authService.js'
import { isExpired } from '../utils/dateUtils.js'

// Tao "kho" luu thong tin dang nhap dung chung cho toan web
const AuthContext = createContext(null)

const STORAGE_KEY = 'zhongwen_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Khi mo web: doc lai tai khoan da luu trong trinh duyet (neu co)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Neu tai khoan da het han -> tu dong ha xuong 'normal'
        if (parsed?.expire_date && isExpired(parsed.expire_date) && !parsed.is_unlimited) {
          parsed.plan = 'normal'
        }
        setUser(parsed)
      }
    } catch {
      // bo qua neu du lieu loi
    }
    setLoading(false)
  }, [])

  /**
   * Dang nhap: kiem tra username + password + vai tro.
   * @param {string} username
   * @param {string} password
   * @param {string} role - 'admin' hoac 'student'
   */
  async function login(username, password, role) {
    const account = await loginUser(username, password, role)

    // Neu het han va khong vo han -> ha goi xuong thuong
    if (account.expire_date && isExpired(account.expire_date) && !account.is_unlimited) {
      account.plan = 'normal'
    }

    setUser(account)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
    return account
  }

  // Dang xuat
  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Cac gia tri tien loi de kiem tra nhanh
  const isLoggedIn = Boolean(user)
  const isAdmin = user?.role === 'admin'
  const isStudent = user?.role === 'student'

  const value = {
    user,
    loading,
    isLoggedIn,
    isAdmin,
    isStudent,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook de cac trang khac lay thong tin dang nhap
export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext phai duoc dung ben trong <AuthProvider>')
  }
  return ctx
}