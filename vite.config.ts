import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sola-megagigageilisieche/',
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  publicDir: 'public',
})
