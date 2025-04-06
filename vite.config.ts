import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.tsx',  
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', 
    },
  },
});