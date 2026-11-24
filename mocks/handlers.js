import { http, HttpResponse } from 'msw'
import { getActiveKeys } from './mode.js'
import { getMockMemory, updateMockMemory } from './memory.js'
import status from './status.js'

function mockEndpoint(path, scenarios) {
  if (typeof scenarios.default !== 'function') {
    throw new TypeError(`Mock API ${path} requires a default handler`)
  }

  return http.get(`*/api${path}`, async () => {
    const key = getActiveKeys().reverse().find((active) => Object.hasOwn(scenarios, active)) ?? 'default'
    const [returnCode, returnBody, toMemory] = await scenarios[key]({}, getMockMemory())
    updateMockMemory(toMemory)
    return HttpResponse.json(returnBody, { status: returnCode })
  })
}

export const appHandlers = [
  mockEndpoint('/status', status),
]
