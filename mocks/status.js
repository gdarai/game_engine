import { STATUS_OK } from '@fixtures/status.js'
import { error } from './error.js'

export default {
  default: (_, memory) => [200, STATUS_OK, { statusChecks: (memory.statusChecks ?? 0) + 1 }],
  error,
}
