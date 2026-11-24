export const memoryStates = {
  checked: {
    statusChecks: 1,
  },
}

let memory = {}

export function getMockMemory() {
  return memory
}

export function updateMockMemory(toMemory) {
  if (toMemory === undefined) return
  if (toMemory === null || typeof toMemory !== 'object' || Array.isArray(toMemory)) {
    throw new TypeError('Mock memory update must be an object')
  }
  memory = { ...memory, ...toMemory }
}

export function resetMemory(state) {
  if (state !== undefined && !Object.hasOwn(memoryStates, state)) {
    throw new Error(`Unknown mock memory state: ${state}`)
  }
  memory = state === undefined ? {} : structuredClone(memoryStates[state])
}
