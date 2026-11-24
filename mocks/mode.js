const STORAGE_KEY = 'game-layer.mockKeys'
const activeKeys = typeof sessionStorage === 'undefined'
  ? []
  : JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')

function saveKeys() {
  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(STORAGE_KEY, JSON.stringify(activeKeys))
}

export function addKey(key) {
  if (typeof key !== 'string' || !key) throw new TypeError('Mock key must be a nonempty string')
  removeKey(key)
  activeKeys.push(key)
  saveKeys()
}

export function removeKey(key) {
  if (typeof key !== 'string' || !key) throw new TypeError('Mock key must be a nonempty string')
  const index = activeKeys.indexOf(key)
  if (index !== -1) activeKeys.splice(index, 1)
  saveKeys()
}

export function clearKeys() {
  activeKeys.length = 0
  saveKeys()
}

export function getActiveKeys() {
  return [...activeKeys]
}
