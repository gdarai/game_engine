import {
  drawTextScreen, engineInit, mainCanvasSize, mainContext, rgb,
  setCanvasClearColor, setCanvasFixedSize, setDebugWatermark,
  setGLEnable, timeDelta, vec2,
} from 'littlejsengine'
import { backend } from '@api/index.js'
import { startLoginScene } from '@scenes/login.js'
import { getMemory, setError } from '@utils/memory.js'
import '@styles/app.css'

const engine = {
  drawTextScreen, engineInit, rgb, setCanvasClearColor, setCanvasFixedSize, vec2,
  get mainCanvasSize() { return mainCanvasSize },
  get mainContext() { return mainContext },
  get timeDelta() { return timeDelta },
}

async function main() {
  if (import.meta.env.DEV) {
    const { worker } = await import('../mocks/browser.js')
    await worker.start({ serviceWorker: { url: '/mockServiceWorker.js' }, onUnhandledRequest: 'bypass' })
  }

  await document.fonts.load('600 42px Inter')
  if (!document.fonts.check('600 42px Inter')) throw new Error('Inter font could not be loaded')
  if (getMemory().scene !== 'login') throw new Error(`Unknown scene: ${getMemory().scene}`)
  setDebugWatermark(false)
  setGLEnable(false)
  const scene = await startLoginScene({ root: document.getElementById('app'), backend, engine })

  try {
    const { username, password } = backend.getCredentials()
    scene.view.username.value = username
    scene.view.password.value = password
  } catch (error) {
    setError(`Unable to load saved username: ${error.message}`)
  }

  try {
    await backend.getStatus()
  } catch (error) {
    setError(`Service unavailable: ${error.message}`)
  }
}

main().catch((error) => {
  setError(error.message)
  console.error(error)
  const app = document.getElementById('app')
  if (app && !app.textContent.trim()) app.textContent = `Unable to start: ${error.message}`
})
