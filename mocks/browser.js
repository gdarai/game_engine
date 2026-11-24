import { setupWorker } from 'msw/browser'
import { appHandlers } from './handlers.js'
import { mockControlHandlers } from './controls.js'

export const worker = setupWorker(...mockControlHandlers, ...appHandlers)
