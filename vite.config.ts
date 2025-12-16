import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/pobb': {
        target: 'https://pobb.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pobb/, ''),
      }
    }
  },
  json: {
    stringify: true  // Don't parse JSON, just serve it as string
  }
})
