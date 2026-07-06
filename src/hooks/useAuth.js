import { useAuthContext } from '../context/AuthContext.jsx'

// Hook rut gon: cac trang chi can goi useAuth() de lay thong tin dang nhap
export function useAuth() {
  return useAuthContext()
}