import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    headers: {
      'Cache-Control': 'no-store',
    },
    proxy: {
      "/api/chat": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
})
