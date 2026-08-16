import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(import.meta.dirname, 'src/shared'),
      '@config': path.resolve(import.meta.dirname, 'src/config'),
      '@features': path.resolve(import.meta.dirname, 'src/features'),
      '@data': path.resolve(import.meta.dirname, 'src/data'),
    },
  },
})
