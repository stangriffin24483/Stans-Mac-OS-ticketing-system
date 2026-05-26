import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist'
  },
  server: {
    middlewareMode: false
  },
  define: {
    'process.env.VITE_DEV_SERVER_URL': JSON.stringify('http://localhost:5173')
  }
})
