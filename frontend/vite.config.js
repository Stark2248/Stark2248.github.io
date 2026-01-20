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
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('framer-motion')) {
              return 'vendor_react'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
