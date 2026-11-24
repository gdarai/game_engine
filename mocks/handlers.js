import { http, HttpResponse } from 'msw'
import { getActiveKeys } from '@mocks/mode'
import { getMockMemory, updateMockMemory } from '@mocks/memory'
//import create from '@mocks/new/create'

function gameEndpoint(path, scenarios) {
  if (typeof scenarios.default !== 'function') {
    throw new TypeError(`Mock API ${path} requires a default handler`)
  }

  return http.post(`*/api${path}`, async ({ request }) => {
    const keys = getActiveKeys()
    const key = keys.reverse().find((active) => Object.hasOwn(scenarios, active)) ?? 'default'
    const text = await request.text()
    const apiBody = text ? JSON.parse(text) : {}
    const [returnCode, returnBody, toMemory] = await scenarios[key](apiBody, getMockMemory())
    updateMockMemory(toMemory)
    return HttpResponse.json(returnBody, { status: returnCode })
  })
}

export const gameHandlers = [
  //gameEndpoint('/new/create', create),
]
