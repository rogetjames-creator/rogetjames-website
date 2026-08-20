import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Cache-buster versions for replaced images. Every /media replace-in-place is
// recorded in media-manifest.json (the target path + when it happened). We read
// that at build time and map each replaced image path -> a version stamp; the
// image helper appends it to the URL so a replacement gets a NEW address and
// shows instantly for everyone, instead of being served from a stale cache of
// the same address. Unchanged images keep their normal caching (stay fast).
function buildImgVersions() {
  try {
    const m = JSON.parse(readFileSync(resolve(__dirname, 'public/media-manifest.json'), 'utf8'))
    const map = {}
    const rx = /images\/[^\s"'|)]+\.(?:jpe?g|png|webp|gif)/gi
    for (const e of (Array.isArray(m) ? m : [])) {
      if (!e || !e.createdTime) continue
      if (!/replac|in place|auto-applied/i.test(e.note || '')) continue
      const v = Date.parse(e.createdTime) || 0
      const cands = (e.note || '').match(rx) || []
      if (e.path && !/^images\/uploads\//i.test(e.path)) cands.push(e.path)
      for (const c of cands) {
        const key = '/' + String(c).replace(/^\/+/, '')
        if (v >= Number(map[key] || 0)) map[key] = String(v)
      }
    }
    return map
  } catch { return {} }
}

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
  define: {
    __IMG_VERSIONS__: JSON.stringify(buildImgVersions()),
  },
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
