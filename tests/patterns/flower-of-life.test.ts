import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as THREE from 'three'

// Mock the DOM for Three.js
beforeEach(() => {
  vi.stubGlobal('document', {
    createElement: () => ({
      getContext: () => null,
      style: {}
    }),
    body: {
      appendChild: vi.fn()
    }
  })
})

describe('createFlowerOfLife', () => {
  it('creates a THREE.Group', async () => {
    const { createFlowerOfLife } = await import('../../src/patterns/flower-of-life')
    const group = createFlowerOfLife()
    expect(group).toBeInstanceOf(THREE.Group)
  })

  it('creates correct number of circles based on config', async () => {
    const { createFlowerOfLife } = await import('../../src/patterns/flower-of-life')
    const { CONFIG } = await import('../../src/config')
    const { getExpectedCircleCount } = await import('../../src/utils/geometry')

    const group = createFlowerOfLife()
    const expectedCount = getExpectedCircleCount(CONFIG.flowerRings)
    expect(group.children).toHaveLength(expectedCount)
  })

  it('creates Line objects', async () => {
    const { createFlowerOfLife } = await import('../../src/patterns/flower-of-life')
    const group = createFlowerOfLife()

    for (const child of group.children) {
      expect(child).toBeInstanceOf(THREE.Line)
    }
  })
})

describe('animateFlowerOfLife', () => {
  it('scales the group based on time', async () => {
    const { createFlowerOfLife, animateFlowerOfLife } = await import(
      '../../src/patterns/flower-of-life'
    )
    const group = createFlowerOfLife()

    // At time 0, scale should be close to 1 (sin(0) = 0)
    animateFlowerOfLife(group, 0)
    expect(group.scale.x).toBeCloseTo(1, 2)
    expect(group.scale.y).toBeCloseTo(1, 2)
    expect(group.scale.z).toBe(1)
  })

  it('changes scale over time', async () => {
    const { createFlowerOfLife, animateFlowerOfLife } = await import(
      '../../src/patterns/flower-of-life'
    )
    const group = createFlowerOfLife()

    animateFlowerOfLife(group, 0)
    const scale1 = group.scale.x

    animateFlowerOfLife(group, Math.PI) // Different time
    const scale2 = group.scale.x

    // Scales should be different at different times
    expect(scale1).not.toBe(scale2)
  })
})
