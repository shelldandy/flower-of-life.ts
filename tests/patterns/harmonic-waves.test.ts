import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as THREE from 'three'

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

describe('createHarmonicWaves', () => {
  it('returns group and waves array', async () => {
    const { createHarmonicWaves } = await import('../../src/patterns/harmonic-waves')
    const result = createHarmonicWaves()

    expect(result).toHaveProperty('group')
    expect(result).toHaveProperty('waves')
    expect(result.group).toBeInstanceOf(THREE.Group)
    expect(Array.isArray(result.waves)).toBe(true)
  })

  it('creates correct number of waves based on config', async () => {
    const { createHarmonicWaves } = await import('../../src/patterns/harmonic-waves')
    const { CONFIG } = await import('../../src/config')

    const { group, waves } = createHarmonicWaves()
    expect(waves).toHaveLength(CONFIG.numHarmonics)
    expect(group.children).toHaveLength(CONFIG.numHarmonics)
  })

  it('wave data has required properties', async () => {
    const { createHarmonicWaves } = await import('../../src/patterns/harmonic-waves')
    const { waves } = createHarmonicWaves()

    for (const wave of waves) {
      expect(wave).toHaveProperty('line')
      expect(wave).toHaveProperty('geometry')
      expect(wave).toHaveProperty('positions')
      expect(wave).toHaveProperty('harmonic')
      expect(wave.line).toBeInstanceOf(THREE.Line)
      expect(wave.geometry).toBeInstanceOf(THREE.BufferGeometry)
      expect(wave.positions).toBeInstanceOf(Float32Array)
      expect(wave.harmonic).toBeTypeOf('number')
    }
  })

  it('positions waves vertically by harmonic', async () => {
    const { createHarmonicWaves } = await import('../../src/patterns/harmonic-waves')
    const { CONFIG } = await import('../../src/config')
    const { waves } = createHarmonicWaves()

    for (const wave of waves) {
      const expectedY = wave.harmonic * CONFIG.verticalSpacing
      expect(wave.line.position.y).toBeCloseTo(expectedY, 5)
    }
  })
})

describe('animateHarmonicWaves', () => {
  it('updates geometry positions', async () => {
    const { createHarmonicWaves, animateHarmonicWaves } = await import(
      '../../src/patterns/harmonic-waves'
    )
    const { waves } = createHarmonicWaves()

    // Get initial positions
    const initialPositions = new Float32Array(waves[0]!.positions)

    // Animate at different time
    animateHarmonicWaves(waves, 1)

    // Positions should have changed
    const newPositions = waves[0]!.positions
    let changed = false
    for (let i = 0; i < initialPositions.length; i++) {
      if (initialPositions[i] !== newPositions[i]) {
        changed = true
        break
      }
    }
    expect(changed).toBe(true)
  })

  it('calls animation without errors', async () => {
    const { createHarmonicWaves, animateHarmonicWaves } = await import(
      '../../src/patterns/harmonic-waves'
    )
    const { waves } = createHarmonicWaves()

    // Should not throw
    expect(() => animateHarmonicWaves(waves, 1)).not.toThrow()
  })
})
