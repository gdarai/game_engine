import { expect, it } from 'vitest'
import { ninePatch } from '@components/ninePatch.js'

it('generates a scalable SVG border with double rounded lines by default', () => {
  const uri = ninePatch({ stroke: '#123abc' })
  const svg = decodeURIComponent(uri)
  expect(svg).toContain('width="32" height="32"')
  expect(svg).toContain('stroke="#123abc"')
  expect(svg.match(/%3Crect|<rect/g)).toHaveLength(2)
})

it('supports a second ornament and rejects invalid colors or ornaments', () => {
  expect(decodeURIComponent(ninePatch({ ornament: 'single-rounded' })).match(/<rect/g)).toHaveLength(1)
  expect(() => ninePatch({ stroke: 'red' })).toThrow(TypeError)
  expect(() => ninePatch({ ornament: 'unknown' })).toThrow(TypeError)
})
