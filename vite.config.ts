import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        // Keep Host as the Vite origin so Better Auth cookies bind to :5173
        changeOrigin: false,
      },
    },
  },
})
