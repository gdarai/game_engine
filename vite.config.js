import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const workerPath = fileURLToPath(new URL('./mocks/mockServiceWorker.js', import.meta.url))

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@mocks': fileURLToPath(new URL('./mocks', import.meta.url)),
      '@src': fileURLToPath(new URL('./src', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@fixtures': fileURLToPath(new URL('./src/fixtures', import.meta.url)),
      '@scenes': fileURLToPath(new URL('./src/scenes', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
  plugins: [{
    name: 'local-mock-worker',
    configureServer(server) {
      server.middlewares.use('/mockServiceWorker.js', async (request, response, next) => {
        if (request.method !== 'GET') return next()
        try {
          response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
          response.end(await readFile(workerPath))
        } catch (error) {
          next(error)
        }
      })
    },
  }],
  test: {
    environment: 'node',
    clearMocks: true,
  },
})
