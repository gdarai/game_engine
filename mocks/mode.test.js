import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

it('keeps scenario priorities across a development-page reload', async () => {
  const stored = new Map()
  vi.stubGlobal('sessionStorage', {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
  })
  const mode = await import('./mode.js')
  mode.addKey('error')
  mode.addKey('unknown')
  mode.addKey('error')
  expect(mode.getActiveKeys()).toEqual(['unknown', 'error'])
  vi.resetModules()
  const reloaded = await import('./mode.js')
  expect(reloaded.getActiveKeys()).toEqual(['unknown', 'error'])
  reloaded.removeKey('error')
  expect(reloaded.getActiveKeys()).toEqual(['unknown'])
  reloaded.clearKeys()
  expect(stored.get('game-layer.mockKeys')).toBe('[]')
})
