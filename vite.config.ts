import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'


export default defineConfig({
  plugins: [react(), ssr()],
  build: {
    ssr: true,  
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', 
    },
  },
});