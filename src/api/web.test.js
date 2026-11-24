import { describe, expect, it, vi } from 'vitest'
import { createWebBackend } from '@api/web.js'

function makeBrowser() {
  const values = new Map()
  const localStorage = {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, value)),
  }
  return { localStorage, matchMedia: vi.fn(() => ({ matches: true })) }
}

describe('web backend', () => {
  it('uses the browser orientation', () => {
    const browser = makeBrowser()
    const backend = createWebBackend(browser)
    expect(backend.isPortrait()).toBe(true)
    browser.matchMedia.mockReturnValue({ matches: false })
    expect(backend.isPortrait()).toBe(false)
  })

  it('stores only the username and always returns an empty password', () => {
    const browser = makeBrowser()
    const backend = createWebBackend(browser)
    expect(backend.getCredentials()).toEqual({ username: '', password: '' })
    backend.setCredentials({ username: 'Morgan', password: 'secret' })
    expect(browser.localStorage.setItem).toHaveBeenCalledExactlyOnceWith('game-layer.username', 'Morgan')
    expect(backend.getCredentials()).toEqual({ username: 'Morgan', password: '' })
    expect(() => backend.setCredentials({ username: 42 })).toThrow(TypeError)
  })

  it('does not mask storage failures', () => {
    const browser = makeBrowser()
    browser.localStorage.getItem.mockImplementation(() => { throw new Error('Storage disabled') })
    expect(() => createWebBackend(browser).getCredentials()).toThrow('Storage disabled')
  })

  it('fetches status and validates the expected response', async () => {
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    await expect(createWebBackend(makeBrowser(), request).getStatus()).resolves.toEqual({ ok: true })
    expect(request).toHaveBeenCalledWith('/api/status')
    request.mockResolvedValue({ ok: true, json: async () => ({ ok: false }) })
    await expect(createWebBackend(makeBrowser(), request).getStatus()).rejects.toThrow('Invalid status')
    request.mockResolvedValue({ ok: false, status: 503 })
    await expect(createWebBackend(makeBrowser(), request).getStatus()).rejects.toThrow('HTTP 503')
  })
})
