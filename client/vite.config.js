// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- IMPORT TAILWIND PLUGIN

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // <-- INITIALIZE TAILWIND COMPILER ENGINE
  ],
})