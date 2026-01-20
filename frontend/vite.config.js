import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } },
  build: {
    outDir: '../docs',
    assetsDir: 'assets',
    emptyOutDir: true
    ,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          // match specific packages to avoid accidental overlaps that create circular imports
          if (/node_modules[\\/](react|react-dom|framer-motion)/.test(id)) return 'vendor_react'
          return 'vendor'
        }
      }
    }
  }
})
