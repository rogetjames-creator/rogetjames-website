import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        vault: resolve(__dirname, 'vault.html'),
      },
    },
  },
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
      "/api/vault-verify": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
      "/api/vault-invite": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
})
