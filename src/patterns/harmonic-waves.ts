import { BufferGeometry, BufferAttribute, LineBasicMaterial, Line, Group } from 'three'
import { CONFIG } from '../config'

export interface WaveData {
  line: Line
  geometry: BufferGeometry
  positions: Float32Array
  harmonic: number
}

function updateWaveGeometry(positions: Float32Array, harmonic: number, time: number): void {
  const amplitude = CONFIG.baseAmplitude / Math.sqrt(harmonic)

  for (let i = 0; i < CONFIG.waveSegments; i++) {
    const t = i / (CONFIG.waveSegments - 1)
    const x = (t - 0.5) * CONFIG.waveWidth
    const phase = time * CONFIG.waveAnimationSpeed * harmonic
    const z = amplitude * Math.sin(harmonic * t * Math.PI * 2 + phase)

    positions[i * 3] = x
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = z
  }
}

function createWave(harmonic: number): WaveData {
  const geometry = new BufferGeometry()
  const positions = new Float32Array(CONFIG.waveSegments * 3)

  updateWaveGeometry(positions, harmonic, 0)

  geometry.setAttribute('position', new BufferAttribute(positions, 3))

  const opacity = 1.0 - (harmonic / CONFIG.numHarmonics) * 0.3
  const material = new LineBasicMaterial({
    color: CONFIG.lineColor,
    transparent: true,
    opacity: opacity
  })

  const line = new Line(geometry, material)
  line.position.y = harmonic * CONFIG.verticalSpacing

  return { line, geometry, positions, harmonic }
}

export interface HarmonicWavesResult {
  group: Group
  waves: WaveData[]
}

export function createHarmonicWaves(): HarmonicWavesResult {
  const group = new Group()
  const waves: WaveData[] = []

  for (let h = 1; h <= CONFIG.numHarmonics; h++) {
    const wave = createWave(h)
    waves.push(wave)
    group.add(wave.line)
  }

  return { group, waves }
}

export function animateHarmonicWaves(waves: WaveData[], time: number): void {
  for (const wave of waves) {
    updateWaveGeometry(wave.positions, wave.harmonic, time)
    const positionAttr = wave.geometry.attributes.position
    if (positionAttr) {
      positionAttr.needsUpdate = true
    }
  }
}
