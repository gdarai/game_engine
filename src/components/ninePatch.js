export function ninePatch({ stroke = '#a9dbec', ornament = 'double-rounded' } = {}) {
  if (!/^#[0-9a-f]{6}$/i.test(stroke)) throw new TypeError('Nine-patch stroke must be a hex color')
  if (!['double-rounded', 'single-rounded'].includes(ornament)) {
    throw new TypeError('Unknown nine-patch ornament')
  }
  const outer = `<rect x="1" y="1" width="30" height="30" rx="9" fill="none" stroke="${stroke}" stroke-width="2"/>`
  const inner = ornament === 'double-rounded'
    ? `<rect x="5" y="5" width="22" height="22" rx="5" fill="none" stroke="${stroke}" stroke-width="1"/>`
    : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${outer}${inner}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
