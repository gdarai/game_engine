const state = { scene: 'login', error: '' }
const listeners = new Set()

export function getMemory() {
  return { ...state }
}

export function setScene(scene) {
  if (typeof scene !== 'string' || !scene) throw new TypeError('Scene must be a nonempty string')
  state.scene = scene
  for (const listener of listeners) listener(getMemory())
}

export function setError(error) {
  if (typeof error !== 'string') throw new TypeError('Error must be a string')
  state.error = error
  for (const listener of listeners) listener(getMemory())
}

export function subscribe(listener) {
  if (typeof listener !== 'function') throw new TypeError('Listener must be a function')
  listeners.add(listener)
  return () => listeners.delete(listener)
}
