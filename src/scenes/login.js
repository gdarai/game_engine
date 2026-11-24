import { Button } from '@components/Button.js'
import { PasswordInput } from '@components/PasswordInput.js'
import { TextInput } from '@components/TextInput.js'
import { advanceText } from '@utils/bounce.js'
import { fitViewport } from '@utils/viewport.js'
import { getMemory, setError, subscribe } from '@utils/memory.js'

export function createLoginView(backend) {
  const form = document.createElement('form')
  form.className = 'login-form'
  form.noValidate = true
  const heading = document.createElement('h1')
  heading.textContent = 'Welcome'
  const username = TextInput({ label: 'Username', name: 'username' })
  const password = PasswordInput({ label: 'Password', name: 'password' })
  const fields = document.createElement('div')
  fields.className = 'form-fields'
  fields.append(username.element, password.element)
  const error = document.createElement('p')
  error.className = 'form-error'
  error.setAttribute('role', 'alert')
  const actions = document.createElement('div')
  actions.className = 'form-actions'
  const login = Button({ label: 'Login', type: 'submit' })
  const create = Button({ label: 'Create' })
  actions.append(login, create)
  form.append(heading, fields, error, actions)

  const unsubscribe = subscribe((memory) => {
    error.textContent = memory.error
    error.hidden = !memory.error
  })
  error.textContent = getMemory().error
  error.hidden = !error.textContent

  function save() {
    const name = username.input.value.trim()
    if (!name || !password.input.value.trim()) {
      setError('Enter both a username and password.')
      return
    }
    try {
      backend.setCredentials({ username: name, password: password.input.value })
      setError('')
    } catch (cause) {
      setError(`Unable to save username: ${cause.message}`)
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    save()
  })
  create.addEventListener('click', save)

  return { element: form, username: username.input, password: password.input, dispose: unsubscribe }
}

export async function startLoginScene({ root, backend, engine, browser = window }) {
  const viewport = document.createElement('div')
  viewport.className = 'game-viewport'
  const canvasRoot = document.createElement('div')
  canvasRoot.className = 'canvas-root'
  const controls = document.createElement('div')
  controls.className = 'browser-layer'
  const view = createLoginView(backend)
  controls.append(view.element)
  viewport.append(canvasRoot, controls)
  root.append(viewport)

  const text = 'Game Layer'
  let position = { x: 0, y: 0 }
  let velocity = { x: 24, y: 18 }
  let halfSize = { x: 0, y: 0 }
  let fontSize = 0

  function measureLabel(size) {
    fontSize = Math.min(42, size.x / 9)
    engine.mainContext.font = `600 ${fontSize}px Inter`
    let width = engine.mainContext.measureText(text).width
    if (width > size.x - 12) {
      fontSize *= (size.x - 12) / width
      engine.mainContext.font = `600 ${fontSize}px Inter`
      width = engine.mainContext.measureText(text).width
    }
    halfSize = { x: width / 2, y: fontSize / 2 }
  }

  function resize() {
    const size = fitViewport(browser.innerWidth, browser.innerHeight, backend.isPortrait())
    viewport.style.width = `${size.width}px`
    viewport.style.height = `${size.height}px`
    engine.setCanvasFixedSize(engine.vec2(size.width, size.height))
    if (engine.mainContext) {
      measureLabel({ x: size.width, y: size.height })
      position = advanceText(position, velocity, { x: size.width, y: size.height }, halfSize, 0).position
    }
  }

  engine.setCanvasClearColor(engine.rgb(0.05, 0.14, 0.21))
  browser.addEventListener('resize', resize)
  resize()

  try {
    await engine.engineInit(
      () => {
        measureLabel(engine.mainCanvasSize)
        position = { x: engine.mainCanvasSize.x / 2, y: engine.mainCanvasSize.y / 3 }
      },
      () => {
        const result = advanceText(position, velocity, engine.mainCanvasSize, halfSize, engine.timeDelta)
        position = result.position
        velocity = result.velocity
      },
      undefined,
      undefined,
      () => {
        engine.drawTextScreen(text, engine.vec2(position.x, position.y),
          fontSize, engine.rgb(0.82, 0.94, 1), 0, undefined, 'center', 'Inter', '600')
      },
      [],
      canvasRoot,
    )
  } catch (error) {
    browser.removeEventListener('resize', resize)
    view.dispose()
    viewport.remove()
    throw error
  }

  return {
    view,
    viewport,
    dispose() {
      browser.removeEventListener('resize', resize)
      view.dispose()
    },
  }
}
