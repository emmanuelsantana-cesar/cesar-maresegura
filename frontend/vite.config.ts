import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { gzipSync } from 'node:zlib'
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// Endereço da placa na rede. Usado só no `npm run dev`:
// as chamadas para /api são repassadas para a ESP32 de verdade.
// Se o esp32.local não funcionar na sua rede, use o IP do Serial Monitor:
//   $env:ESP32_URL="http://172.26.64.90"; npm run dev
const ESP32 = process.env.ESP32_URL ?? 'http://esp32.local'

// Pasta do sketch que é enviada pelo "Upload LittleFS".
const DATA_DIR = resolve(import.meta.dirname, '../data')

// Troca os .js/.css do build pela versão comprimida (.gz), ~3x menor.
// O servidor da ESP32 entrega o .gz sozinho quando o navegador pede o .js/.css.
function gzipParaEsp32(): Plugin {
  return {
    name: 'gzip-para-esp32',
    apply: 'build',
    closeBundle() {
      const pasta = join(DATA_DIR, 'assets')
      for (const nome of readdirSync(pasta)) {
        if (!/\.(js|css)$/.test(nome)) continue
        const arquivo = join(pasta, nome)
        writeFileSync(`${arquivo}.gz`, gzipSync(readFileSync(arquivo), { level: 9 }))
        unlinkSync(arquivo)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), gzipParaEsp32()],
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
