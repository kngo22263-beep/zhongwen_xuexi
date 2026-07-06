import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cấu hình Vite để build ổn định trên các nền tảng như Vercel/GitHub
export default defineConfig({
  plugins: [react()],
  build: {
    // Đảm bảo rollup tìm đúng file gốc
    rollupOptions: {
      input: './index.html'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})