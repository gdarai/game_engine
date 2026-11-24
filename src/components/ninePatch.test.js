// @vitest-environment jsdom
import { expect, it } from 'vitest'
import { ninePatch } from '@components/ninePatch.js'
import { applySkin } from '@components/skin.js'

it('uses a bundled local SVG with the existing corner size by default', () => {
  const { source, slice } = ninePatch()
  expect(source).toContain('double-rounded.svg')
  expect(source).not.toContain('data:')
  expect(slice).toBe(12)
})

it('accepts named SVG and PNG assets with explicit corner slices', () => {
  expect(ninePatch({ image: 'double-rounded.svg', slice: 6 })).toEqual({
    source: expect.stringContaining('double-rounded.svg'), slice: 6,
  })
  expect(ninePatch({ image: 'single-rounded.png', slice: 8 })).toEqual({
    source: expect.stringContaining('single-rounded.png'), slice: 8,
  })
})

it('rejects unknown assets, remote URLs, and invalid or missing slices', () => {
  expect(() => ninePatch({ image: 'missing.svg', slice: 8 })).toThrow(TypeError)
  expect(() => ninePatch({ image: 'https://example.com/skin.png', slice: 8 })).toThrow(TypeError)
  expect(() => ninePatch({ image: '../fonts/OFL.txt', slice: 8 })).toThrow(TypeError)
  expect(() => ninePatch({ image: 'single-rounded.png' })).toThrow(/slice is required/)
  for (const slice of [null, 0, -1, NaN, Infinity, '8']) {
    expect(() => ninePatch({ slice })).toThrow(TypeError)
  }
})

it('applies each image slice to border, source, and corner geometry independently', () => {
  const defaultElement = applySkin(document.createElement('button'))
  const pngElement = applySkin(document.createElement('button'), {
    image: 'single-rounded.png', slice: 8, background: '#123456',
  })
  expect(defaultElement.style.borderWidth).toBe('12px')
  expect(defaultElement.style.borderImageSlice).toBe('12')
  expect(defaultElement.style.borderImageWidth).toBe('12px')
  expect(defaultElement.style.borderImageSource).toContain('double-rounded.svg')
  expect(pngElement.style.borderWidth).toBe('8px')
  expect(pngElement.style.borderImageSlice).toBe('8')
  expect(pngElement.style.borderImageWidth).toBe('8px')
  expect(pngElement.style.borderImageSource).toContain('single-rounded.png')
  expect(pngElement.style.backgroundColor).toBe('rgb(18, 52, 86)')
  expect(() => applySkin(document.createElement('div'), { background: 'red' })).toThrow(TypeError)
})
