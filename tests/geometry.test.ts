import { describe, it, expect } from 'vitest'
import {
  getFlowerPositions,
  get3DFlowerPositions,
  getExpectedCircleCount
} from '../src/utils/geometry'

describe('getFlowerPositions', () => {
  it('returns 1 position for 0 rings (center only)', () => {
    const positions = getFlowerPositions(0, 1)
    expect(positions).toHaveLength(1)
    expect(positions[0]).toEqual({ x: 0, y: 0 })
  })

  it('returns 7 positions for 1 ring', () => {
    const positions = getFlowerPositions(1, 1)
    expect(positions).toHaveLength(7)
    // Center should be first
    expect(positions[0]).toEqual({ x: 0, y: 0 })
  })

  it('returns 19 positions for 2 rings', () => {
    const positions = getFlowerPositions(2, 1)
    expect(positions).toHaveLength(19)
  })

  it('returns 37 positions for 3 rings', () => {
    const positions = getFlowerPositions(3, 1)
    expect(positions).toHaveLength(37)
  })

  it('scales positions by radius', () => {
    const radius = 2
    const positions = getFlowerPositions(1, radius)

    // Check that positions in ring 1 are at distance radius from center
    const ringPositions = positions.slice(1)
    for (const pos of ringPositions) {
      const distance = Math.sqrt(pos.x ** 2 + pos.y ** 2)
      expect(distance).toBeCloseTo(radius, 5)
    }
  })
})

describe('get3DFlowerPositions', () => {
  it('returns correct count for single layer', () => {
    const positions = get3DFlowerPositions(1, 1, 1, 1)
    // 1 ring = 7 positions, 1 layer
    expect(positions).toHaveLength(7)
  })

  it('multiplies by number of layers', () => {
    const positions = get3DFlowerPositions(1, 1, 3, 1)
    // 1 ring = 7 positions, 3 layers = 21 total
    expect(positions).toHaveLength(21)
  })

  it('centers positions vertically', () => {
    const positions = get3DFlowerPositions(0, 1, 3, 2)
    // 3 layers at spacing 2: z = 0, 2, 4 -> centered to -2, 0, 2
    const zValues = positions.map((p) => p.z)
    expect(Math.min(...zValues)).toBeCloseTo(-2, 5)
    expect(Math.max(...zValues)).toBeCloseTo(2, 5)
  })

  it('offsets alternate layers for close-packing', () => {
    const positions = get3DFlowerPositions(0, 2, 2, 1)
    // Layer 0: center at (0, 0)
    // Layer 1: offset by (spacing * 0.5, spacing * sqrt(3)/6)
    const layer0 = positions.filter((p) => p.z < 0)
    const layer1 = positions.filter((p) => p.z > 0)

    expect(layer0[0]?.x).toBe(0)
    expect(layer1[0]?.x).toBeCloseTo(1, 5) // spacing * 0.5 = 1
  })
})

describe('getExpectedCircleCount', () => {
  it('returns 1 for 0 rings', () => {
    expect(getExpectedCircleCount(0)).toBe(1)
  })

  it('returns 7 for 1 ring', () => {
    expect(getExpectedCircleCount(1)).toBe(7)
  })

  it('returns 19 for 2 rings', () => {
    expect(getExpectedCircleCount(2)).toBe(19)
  })

  it('returns 37 for 3 rings', () => {
    expect(getExpectedCircleCount(3)).toBe(37)
  })

  it('matches actual getFlowerPositions output', () => {
    for (let rings = 0; rings <= 5; rings++) {
      const actual = getFlowerPositions(rings, 1).length
      const expected = getExpectedCircleCount(rings)
      expect(actual).toBe(expected)
    }
  })
})
