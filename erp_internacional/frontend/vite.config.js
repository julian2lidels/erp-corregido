import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo local, las llamadas a /api se envían al backend FastAPI
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
