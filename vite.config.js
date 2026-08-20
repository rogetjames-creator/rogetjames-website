import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Block right-click (and its "Save image as…") on every image, site-wide.
// Injected into the <head> of every HTML entry so it runs before anything
// renders, on all pages. Uses elementsFromPoint so it also blocks images that
// sit under an overlay (gallery gradients, hover layers). CSP allows inline
// scripts (script-src 'self' 'unsafe-inline').
const noImageRightClick = () => ({
  name: 'no-image-right-click',
  transformIndexHtml() {
    return [{
      tag: 'script',
      injectTo: 'head',
      children:
        "document.addEventListener('contextmenu',function(e){" +
        // Owner bypass: the admin password cached by /media, /admin, /stats
        // (localStorage 'stats_key') marks James's own device — he needs
        // right-click to copy image addresses for replacements. Everyone else
        // is blocked.
        "try{if(localStorage.getItem('stats_key'))return;}catch(_){}" +
        "var hit=false;" +
        "try{var els=document.elementsFromPoint?document.elementsFromPoint(e.clientX,e.clientY):[];" +
        "for(var i=0;i<els.length;i++){if(els[i]&&els[i].tagName==='IMG'){hit=true;break;}}}catch(_){}" +
        "if(!hit){var p=e.composedPath?e.composedPath():[e.target];" +
        "for(var j=0;j<p.length;j++){if(p[j]&&p[j].tagName==='IMG'){hit=true;break;}}}" +
        "if(hit)e.preventDefault();},true);",
    }]
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), noImageRightClick()],
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
