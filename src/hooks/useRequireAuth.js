import { useState } from 'react'
import { useAuth } from './useAuth.js'

/**
 * Hook giup chan khach chua dang nhap khi bam vao chuc nang co phi.
 * Neu chua dang nhap -> mo popup dang nhap.
 * Neu da dang nhap -> cho phep chay hanh dong.
 *
 * Cach dung:
 *   const { requireLogin, showLogin, closeLogin } = useRequireAuth()
 *   <button onClick={() => requireLogin(() => lamGiDo())}>...</button>
 */
export function useRequireAuth() {
  const { isLoggedIn } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  // Kiem tra dang nhap truoc khi cho chay 1 hanh dong
  function requireLogin(action) {
    if (isLoggedIn) {
      if (typeof action === 'function') action()
      return true
    }
    // Chua dang nhap -> mo popup dang nhap
    setShowLogin(true)
    return false
  }

  function closeLogin() {
    setShowLogin(false)
  }

  return { requireLogin, showLogin, closeLogin, isLoggedIn }
}