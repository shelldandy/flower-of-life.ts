import type * as THREE from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CONFIG, PATTERNS, SPHERE_STYLES, type Pattern, type SphereStyle } from './config'
import { rebuildSpheres3D } from './patterns'

export interface AppState {
  currentPattern: Pattern
  currentSphereStyleIndex: number
}

export interface PatternGroups {
  flowerGroup: THREE.Group
  wavesGroup: THREE.Group
  spheresGroup: THREE.Group
}

function setCamera(
  pattern: Pattern,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls
): void {
  if (pattern === PATTERNS.FLOWER) {
    camera.position.set(0, 0, 12)
    controls.target.set(0, 0, 0)
  } else if (pattern === PATTERNS.WAVES) {
    camera.position.set(8, 6, 12)
    controls.target.set(0, (CONFIG.numHarmonics * CONFIG.verticalSpacing) / 2, 0)
  } else if (pattern === PATTERNS.SPHERES) {
    camera.position.set(8, 6, 10)
    controls.target.set(0, 0, 0)
  }
  controls.update()
}

function updateModeDisplay(pattern: Pattern, sphereStyle: SphereStyle): void {
  const modeNames: Record<Pattern, string> = {
    [PATTERNS.FLOWER]: 'Flower of Life',
    [PATTERNS.WAVES]: 'Harmonic Waves',
    [PATTERNS.SPHERES]: `3D Flower (${sphereStyle})`
  }
  const modeElement = document.getElementById('mode')
  if (modeElement) {
    modeElement.textContent = modeNames[pattern]
  }
}

export function switchPattern(
  pattern: Pattern,
  state: AppState,
  groups: PatternGroups,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls
): void {
  state.currentPattern = pattern
  groups.flowerGroup.visible = pattern === PATTERNS.FLOWER
  groups.wavesGroup.visible = pattern === PATTERNS.WAVES
  groups.spheresGroup.visible = pattern === PATTERNS.SPHERES

  updateModeDisplay(pattern, SPHERE_STYLES[state.currentSphereStyleIndex] as SphereStyle)
  setCamera(pattern, camera, controls)
}

export function setupKeyboardControls(
  state: AppState,
  groups: PatternGroups,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls
): void {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'KeyT') {
      e.preventDefault()
      const patterns = [PATTERNS.FLOWER, PATTERNS.WAVES, PATTERNS.SPHERES] as const
      const currentIndex = patterns.indexOf(state.currentPattern)
      const newPattern = patterns[(currentIndex + 1) % patterns.length]
      if (newPattern) {
        switchPattern(newPattern, state, groups, camera, controls)
      }
    }

    if (e.code === 'KeyS' && state.currentPattern === PATTERNS.SPHERES) {
      e.preventDefault()
      state.currentSphereStyleIndex = (state.currentSphereStyleIndex + 1) % SPHERE_STYLES.length
      const newStyle = SPHERE_STYLES[state.currentSphereStyleIndex] as SphereStyle
      rebuildSpheres3D(groups.spheresGroup, newStyle)
      updateModeDisplay(PATTERNS.SPHERES, newStyle)
    }
  })
}
