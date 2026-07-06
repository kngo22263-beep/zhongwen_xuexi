import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cau hinh Vite - cong cu chay va build website
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})