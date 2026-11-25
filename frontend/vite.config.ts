import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Endereço da placa na rede. Usado só no `npm run dev`:
// as chamadas para /api são repassadas para a ESP32 de verdade.
// Se o esp32.local não funcionar na sua rede, use o IP do Serial Monitor:
//   $env:ESP32_URL="http://172.26.64.90"; npm run dev
const ESP32 = process.env.ESP32_URL ?? 'http://esp32.local'

// Pasta do sketch que é enviada pelo "Upload LittleFS".
const DATA_DIR = resolve(import.meta.dirname, '../data')

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: DATA_DIR,
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': ESP32,
    },
  },
})
