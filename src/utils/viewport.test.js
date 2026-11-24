import { describe, expect, it } from 'vitest'
import { fitViewport } from '@utils/viewport.js'
import { advanceText } from '@utils/bounce.js'

describe('fitViewport', () => {
  it('fits a portrait 9:16 screen within the available area', () => {
    expect(fitViewport(400, 800, true)).toEqual({ width: 400, height: 711 })
  })

  it('fits a landscape 16:9 screen within the available area', () => {
    expect(fitViewport(1200, 700, false)).toEqual({ width: 1200, height: 675 })
  })

  it('rejects invalid dimensions or orientation', () => {
    expect(() => fitViewport(0, 100, true)).toThrow(TypeError)
    expect(() => fitViewport(100, 100, 'portrait')).toThrow(TypeError)
  })
})

describe('advanceText', () => {
  const bounds = { x: 100, y: 80 }
  const halfSize = { x: 20, y: 10 }

  it('moves a label at the requested speed', () => {
    expect(advanceText({ x: 40, y: 40 }, { x: 10, y: -5 }, bounds, halfSize, 2))
      .toEqual({ position: { x: 60, y: 30 }, velocity: { x: 10, y: -5 } })
  })

  it('clamps at the edges and reverses the relevant velocity', () => {
    expect(advanceText({ x: 75, y: 12 }, { x: 10, y: -5 }, bounds, halfSize, 1))
      .toEqual({ position: { x: 80, y: 10 }, velocity: { x: -10, y: 5 } })
  })

  it('keeps oversized text in the available screen', () => {
    expect(advanceText({ x: 50, y: 40 }, { x: -10, y: 0 }, bounds, { x: 60, y: 10 }, 1)
      .position.x).toBe(60)
    expect(() => advanceText({ x: 0, y: 0 }, { x: 1, y: 1 }, bounds, halfSize, -1))
      .toThrow(TypeError)
  })
})
