import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Critters from 'critters'

function criticalCssPlugin() {
  return {
    name: 'critical-css',
    apply: 'build',
    async closeBundle() {
      const critters = new Critters({ path: resolve(__dirname, 'dist'), publicPath: '/', inlineFonts: false, pruneSource: false })
      for (const htmlFile of ['dist/index.html', 'dist/vault.html', 'dist/stats.html', 'dist/media.html']) {
        const fullPath = resolve(__dirname, htmlFile)
        try {
          const html = readFileSync(fullPath, 'utf8')
          const result = await critters.process(html)
          writeFileSync(fullPath, result)
        } catch (_) {}
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), criticalCssPlugin()],
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        vault: resolve(__dirname, 'vault.html'),
        stats: resolve(__dirname, 'stats.html'),
        media: resolve(__dirname, 'media.html'),
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
