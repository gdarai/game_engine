import { error } from '@mocks/error'
function create(fromApi, mockMemory) {
  return [200, { ok: true }, { called: true }]
}

export default {
  default: create,
  error,
}
