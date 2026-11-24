export function fitViewport(availableWidth, availableHeight, portrait) {
  if (!Number.isFinite(availableWidth) || !Number.isFinite(availableHeight) ||
      availableWidth <= 0 || availableHeight <= 0 || typeof portrait !== 'boolean') {
    throw new TypeError('Viewport requires positive dimensions and an orientation')
  }
  const aspect = portrait ? 9 / 16 : 16 / 9
  const width = Math.floor(Math.min(availableWidth, availableHeight * aspect))
  return { width, height: Math.floor(Math.min(availableHeight, width / aspect)) }
}
