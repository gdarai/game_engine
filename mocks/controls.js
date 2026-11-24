import { http, HttpResponse } from 'msw'
import { addKey, removeKey, clearKeys } from './mode.js'
import { getMockMemory, memoryStates, resetMemory } from './memory.js'

async function readBody(request) {
  const text = await request.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error
    return null
  }
}

function invalid(message) {
  return HttpResponse.json({ message }, { status: 400 })
}

export const mockControlHandlers = [
  http.post('*/api/__mock/addKey', async ({ request }) => {
    const body = await readBody(request)
    if (typeof body?.key !== 'string' || !body.key) return invalid('Mock key must be a nonempty string')
    addKey(body.key)
    return HttpResponse.json({ ok: true })
  }),
  http.post('*/api/__mock/removeKey', async ({ request }) => {
    const body = await readBody(request)
    if (typeof body?.key !== 'string' || !body.key) return invalid('Mock key must be a nonempty string')
    removeKey(body.key)
    return HttpResponse.json({ ok: true })
  }),
  http.post('*/api/__mock/clearKeys', () => {
    clearKeys()
    return HttpResponse.json({ ok: true })
  }),
  http.get('*/api/__mock/getMemory', () => {
    console.log('Mock memory:', structuredClone(getMockMemory()))
    return HttpResponse.json({ ok: true })
  }),
  http.post('*/api/__mock/resetMemory', async ({ request }) => {
    const body = await readBody(request)
    if (body === null || typeof body !== 'object' || Array.isArray(body) || (body.state !== undefined &&
      (typeof body.state !== 'string' || !Object.hasOwn(memoryStates, body.state)))) {
      return invalid('Unknown mock memory state')
    }
    resetMemory(body.state)
    return HttpResponse.json({ ok: true })
  }),
]
