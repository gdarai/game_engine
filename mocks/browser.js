import { setupWorker } from 'msw/browser'
import { gameHandlers } from '@mocks/handlers'
import { mockControlHandlers } from '@mocks/controls'

export const worker = setupWorker(...mockControlHandlers, ...gameHandlers)
