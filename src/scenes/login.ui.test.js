// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { createLoginView, startLoginScene } from '@scenes/login.js'
import { getMemory, setError } from '@utils/memory.js'

afterEach(() => {
  document.body.replaceChildren()
  setError('')
})

function setup() {
  const backend = { setCredentials: vi.fn(), isPortrait: vi.fn(() => true) }
  const view = createLoginView(backend)
  document.body.append(view.element)
  return { backend, view }
}

it('renders accessible controls with the SVG skin in the form', () => {
  const { view } = setup()
  expect(view.element.querySelectorAll('input')).toHaveLength(2)
  expect(view.element.querySelector('input[type=password]').closest('label').textContent).toBe('Password')
  expect(view.element.querySelectorAll('button')).toHaveLength(2)
  expect(view.username.style.borderImageSource).toContain('data:image/svg+xml')
  view.dispose()
})

it('requires both fields and exposes the error to the user', () => {
  const { backend, view } = setup()
  view.username.value = 'Morgan'
  view.element.querySelector('button').click()
  expect(backend.setCredentials).not.toHaveBeenCalled()
  expect(view.element.querySelector('[role=alert]').textContent).toMatch(/username and password/)
  expect(getMemory().error).toMatch(/username and password/)
  view.dispose()
})

it.each(['Login', 'Create'])('%s saves only the entered username and remains on login', (label) => {
  const { backend, view } = setup()
  view.username.value = ' Morgan '
  view.password.value = 'secret'
  const button = [...view.element.querySelectorAll('button')].find((item) => item.textContent === label)
  button.click()
  expect(backend.setCredentials).toHaveBeenCalledWith({ username: 'Morgan', password: 'secret' })
  expect(getMemory()).toEqual({ scene: 'login', error: '' })
  view.dispose()
})

it('shows storage failures instead of reporting success', () => {
  const { backend, view } = setup()
  backend.setCredentials.mockImplementation(() => { throw new Error('blocked') })
  view.username.value = 'Morgan'
  view.password.value = 'secret'
  view.element.querySelector('button').click()
  expect(getMemory().error).toMatch(/blocked/)
  view.dispose()
})

it('uses the orientation to size the LittleJS layer and updates it on resize', async () => {
  const backend = { isPortrait: vi.fn(() => true), setCredentials: vi.fn() }
  const handlers = {}
  const browser = {
    innerWidth: 400, innerHeight: 800,
    addEventListener: vi.fn((event, callback) => { handlers[event] = callback }),
    removeEventListener: vi.fn(),
  }
  const engine = {
    vec2: (x, y) => ({ x, y }),
    setCanvasFixedSize: vi.fn(),
    mainCanvasSize: { x: 400, y: 711 },
    mainContext: { font: '', measureText: () => ({ width: 200 }) },
    timeDelta: 1 / 60,
    rgb: vi.fn(),
    setCanvasClearColor: vi.fn(),
    drawTextScreen: vi.fn(),
    engineInit: vi.fn(async (init, update, postUpdate, render, draw, images, canvasRoot) => {
      expect(canvasRoot.className).toBe('canvas-root')
      init()
      update()
      draw()
    }),
  }
  const scene = await startLoginScene({ root: document.body, backend, browser, engine })
  expect(engine.setCanvasFixedSize).toHaveBeenCalledWith({ x: 400, y: 711 })
  expect(engine.drawTextScreen).toHaveBeenCalledWith('Game Layer', expect.anything(),
    expect.any(Number), undefined, 0, undefined, 'center', 'Inter', '600')
  backend.isPortrait.mockReturnValue(false)
  browser.innerWidth = 1200
  browser.innerHeight = 700
  handlers.resize()
  expect(engine.setCanvasFixedSize).toHaveBeenLastCalledWith({ x: 1200, y: 675 })
  expect(scene.viewport.style.height).toBe('675px')
  scene.dispose()
  expect(browser.removeEventListener).toHaveBeenCalledWith('resize', handlers.resize)
})
