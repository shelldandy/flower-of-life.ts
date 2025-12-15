import "./style.css";
import { Clock } from "three";
import { scene, camera, renderer, controls, setupResizeHandler } from "./scene";
import { PATTERNS, SPHERE_STYLES, type SphereStyle } from "./config";
import {
  createFlowerOfLife,
  animateFlowerOfLife,
  createHarmonicWaves,
  animateHarmonicWaves,
  createSpheres3D,
  animateSpheres3D,
  type WaveData,
} from "./patterns";
import {
  switchPattern,
  setupKeyboardControls,
  type AppState,
  type PatternGroups,
} from "./controls";

// Application state
const state: AppState = {
  currentPattern: PATTERNS.FLOWER,
  currentSphereStyleIndex: 0,
};

// Create pattern groups
const flowerGroup = createFlowerOfLife();
const { group: wavesGroup, waves } = createHarmonicWaves();
const spheresGroup = createSpheres3D(
  SPHERE_STYLES[state.currentSphereStyleIndex] as SphereStyle,
);

// Add groups to scene
scene.add(flowerGroup);
scene.add(wavesGroup);
scene.add(spheresGroup);

const groups: PatternGroups = {
  flowerGroup,
  wavesGroup,
  spheresGroup,
};

// Setup controls
setupResizeHandler();
setupKeyboardControls(state, groups, camera, controls);

// Initialize to first pattern
switchPattern(PATTERNS.FLOWER, state, groups, camera, controls);

// Animation loop
const clock = new Clock();

function animate(): void {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  if (state.currentPattern === PATTERNS.FLOWER) {
    animateFlowerOfLife(flowerGroup, time);
  }

  if (state.currentPattern === PATTERNS.WAVES) {
    animateHarmonicWaves(waves as WaveData[], time);
  }

  if (state.currentPattern === PATTERNS.SPHERES) {
    animateSpheres3D(spheresGroup, time);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
