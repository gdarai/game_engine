const activeKeys = []

export function addKey(key) {
  if (typeof key !== 'string' || !key) throw new TypeError('Mock key must be a nonempty string')
  removeKey(key)
  activeKeys.push(key)
}

export function removeKey(key) {
  if (typeof key !== 'string' || !key) throw new TypeError('Mock key must be a nonempty string')
  const index = activeKeys.indexOf(key)
  if (index !== -1) activeKeys.splice(index, 1)
}

export function clearKeys() {
  activeKeys.length = 0
}

export function getActiveKeys() {
  return [...activeKeys]
}
