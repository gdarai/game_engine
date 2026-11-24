import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { appHandlers } from './handlers.js'
import { mockControlHandlers } from './controls.js'
import { clearKeys } from './mode.js'
import { getMockMemory, resetMemory } from './memory.js'

const server = setupServer(...mockControlHandlers, ...appHandlers)
const url = 'http://localhost/api'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  clearKeys()
  resetMemory()
  server.resetHandlers()
})
afterAll(() => server.close())

it('serves a status fixture and tracks checks in mock memory', async () => {
  const response = await fetch(`${url}/status`)
  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({ ok: true })
  expect(getMockMemory()).toEqual({ statusChecks: 1 })
})

it('chooses the last matching scenario and permits restoring the default', async () => {
  await fetch(`${url}/__mock/addKey`, {
    method: 'POST', body: JSON.stringify({ key: 'error' }),
  })
  await fetch(`${url}/__mock/addKey`, {
    method: 'POST', body: JSON.stringify({ key: 'unknown' }),
  })
  const failure = await fetch(`${url}/status`)
  expect(failure.status).toBe(503)
  expect(await failure.json()).toEqual({ message: 'Mock service unavailable' })
  await fetch(`${url}/__mock/clearKeys`, { method: 'POST' })
  expect((await fetch(`${url}/status`)).status).toBe(200)
})

it('resets memory with named snapshots and rejects malformed controls', async () => {
  const reset = await fetch(`${url}/__mock/resetMemory`, {
    method: 'POST', body: JSON.stringify({ state: 'checked' }),
  })
  expect(reset.status).toBe(200)
  expect(getMockMemory()).toEqual({ statusChecks: 1 })
  expect((await fetch(`${url}/__mock/resetMemory`, {
    method: 'POST', body: JSON.stringify({ state: 'missing' }),
  })).status).toBe(400)
  expect((await fetch(`${url}/__mock/addKey`, { method: 'POST', body: '{' })).status).toBe(400)
})
