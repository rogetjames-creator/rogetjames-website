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
        stats: resolve(__dirname, 'stats.html'),
        media: resolve(__dirname, 'media.html'),
        admin: resolve(__dirname, 'admin.html'),
        hero:  resolve(__dirname, 'hero.html'),
        melbourne: resolve(__dirname, 'melbourne.html'),
        perth: resolve(__dirname, 'perth.html'),
        'gold-coast': resolve(__dirname, 'gold-coast.html'),
        sydney: resolve(__dirname, 'sydney.html'),
        'wall-art': resolve(__dirname, 'wall-art.html'),
        'sculpture': resolve(__dirname, 'sculpture.html'),
        'feature-screens': resolve(__dirname, 'feature-screens.html'),
        'screens': resolve(__dirname, 'screens.html'),
        'screens-range': resolve(__dirname, 'screens-range.html'),
        'bespoke-sculpture': resolve(__dirname, 'bespoke-sculpture.html'),
      },
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom'],
          'vendor-gsap':   ['gsap'],
          'vendor-lenis':  ['lenis'],
          'vendor-lucide': ['lucide-react'],
          'vendor-lottie': ['lottie-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
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
      "/api/stats-data": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
})
