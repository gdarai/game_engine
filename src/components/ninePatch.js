const images = import.meta.glob('../assets/ninePatch/*.{svg,png}', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

export function ninePatch({ image = 'double-rounded.svg', slice } = {}) {
  if (typeof image !== 'string' || !Object.hasOwn(images, `../assets/ninePatch/${image}`)) {
    throw new TypeError(`Unknown nine-patch image: ${image}`)
  }
  if (slice === undefined && image !== 'double-rounded.svg') {
    throw new TypeError('Nine-patch slice is required for nondefault images')
  }
  const corner = slice === undefined ? 12 : slice
  if (typeof corner !== 'number' || !Number.isFinite(corner) || corner <= 0) {
    throw new TypeError('Nine-patch slice must be a positive number')
  }
  return { source: `url("${images[`../assets/ninePatch/${image}`]}")`, slice: corner }
}
