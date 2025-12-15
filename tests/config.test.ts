import { describe, it, expect } from 'vitest'
import { CONFIG, PATTERNS, SPHERE_STYLES } from '../src/config'

describe('CONFIG', () => {
  it('has valid color values', () => {
    expect(CONFIG.backgroundColor).toBeTypeOf('number')
    expect(CONFIG.lineColor).toBeTypeOf('number')
    expect(CONFIG.backgroundColor).toBeGreaterThanOrEqual(0)
    expect(CONFIG.lineColor).toBeGreaterThanOrEqual(0)
  })

  it('has positive flower of life values', () => {
    expect(CONFIG.flowerRings).toBeGreaterThan(0)
    expect(CONFIG.circleRadius).toBeGreaterThan(0)
    expect(CONFIG.circleSegments).toBeGreaterThan(0)
  })

  it('has valid wave configuration', () => {
    expect(CONFIG.numHarmonics).toBeGreaterThan(0)
    expect(CONFIG.waveSegments).toBeGreaterThan(0)
    expect(CONFIG.waveWidth).toBeGreaterThan(0)
  })

  it('has valid sphere configuration', () => {
    expect(CONFIG.sphere3dRings).toBeGreaterThanOrEqual(0)
    expect(CONFIG.sphereRadius).toBeGreaterThan(0)
    expect(CONFIG.sphereSegments).toBeGreaterThan(0)
    expect(CONFIG.sphereLayers).toBeGreaterThan(0)
  })
})

describe('PATTERNS', () => {
  it('has three pattern types', () => {
    expect(Object.keys(PATTERNS)).toHaveLength(3)
    expect(PATTERNS.FLOWER).toBe('flower')
    expect(PATTERNS.WAVES).toBe('waves')
    expect(PATTERNS.SPHERES).toBe('spheres')
  })
})

describe('SPHERE_STYLES', () => {
  it('has three styles', () => {
    expect(SPHERE_STYLES).toHaveLength(3)
    expect(SPHERE_STYLES).toContain('solid')
    expect(SPHERE_STYLES).toContain('wireframe')
    expect(SPHERE_STYLES).toContain('glass')
  })
})
