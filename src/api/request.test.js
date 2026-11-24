import { expect, it, vi } from 'vitest'
import { fetchJson } from '@api/request.js'

it('fetches and parses JSON for any API path', async () => {
  const request = vi.fn().mockResolvedValue(new Response('{"items":[]}', {
    headers: { 'Content-Type': 'application/json' },
  }))
  await expect(fetchJson('/api/items', request)).resolves.toEqual({ items: [] })
  expect(request).toHaveBeenCalledExactlyOnceWith('/api/items')
})

it('rejects unsuccessful responses before parsing their body', async () => {
  const json = vi.fn()
  const request = vi.fn().mockResolvedValue({ ok: false, status: 503, json })
  await expect(fetchJson('/api/items', request)).rejects.toThrow('Request failed (HTTP 503)')
  expect(json).not.toHaveBeenCalled()
})

it('reports an HTML response without exposing the JSON parser error', async () => {
  const request = vi.fn().mockResolvedValue(new Response('<!doctype html>', {
    headers: { 'Content-Type': 'text/html' },
  }))
  await expect(fetchJson('/api/items', request))
    .rejects.toThrow('Endpoint returned a non-JSON response')
})

it('reports network errors without masking other failures', async () => {
  const request = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
  await expect(fetchJson('/api/items', request)).rejects.toThrow('Network not available')
  request.mockRejectedValue(new Error('Request aborted'))
  await expect(fetchJson('/api/items', request)).rejects.toThrow('Request aborted')
})
