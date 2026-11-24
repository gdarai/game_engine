export function advanceText(position, velocity, bounds, halfSize, seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new TypeError('Time must be nonnegative')
  const next = { ...position }
  const speed = { ...velocity }
  for (const axis of ['x', 'y']) {
    const min = halfSize[axis]
    const max = Math.max(min, bounds[axis] - min)
    next[axis] = Math.min(max, Math.max(min, next[axis] + speed[axis] * seconds))
    if ((next[axis] === min && speed[axis] < 0) || (next[axis] === max && speed[axis] > 0)) {
      speed[axis] = -speed[axis]
    }
  }
  return { position: next, velocity: speed }
}
