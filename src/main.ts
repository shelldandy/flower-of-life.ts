import "./style.css";
import { Clock } from "three";
import { scene, camera, renderer, controls, setupResizeHandler } from "./scene";
import { PATTERNS, SPHERE_STYLES, type SphereStyle } from "./config";
import {
  createFlowerOfLife,
  animateFlowerOfLife,
  createFlowerOfLifeV2,
  animateFlowerOfLifeV2,
  createHarmonicWaves,
  animateHarmonicWaves,
  createSpheres3D,
  animateSpheres3D,
  type WaveData,
} from "./patterns";
import {
  switchPattern,
  setupKeyboardControls,
  setupPauseButton,
  type AppState,
  type PatternGroups,
} from "./controls";
import { initInteraction, updateHover, clearHover } from "./interaction";

// Application state
const state: AppState = {
  currentPattern: PATTERNS.FLOWER_V2,
  currentSphereStyleIndex: 0,
  isPaused: false,
};

// Create pattern groups
const flowerGroup = createFlowerOfLife();
const flowerV2Group = createFlowerOfLifeV2();
const { group: wavesGroup, waves } = createHarmonicWaves();
const spheresGroup = createSpheres3D(
  SPHERE_STYLES[state.currentSphereStyleIndex] as SphereStyle,
);

// Add groups to scene
scene.add(flowerGroup);
scene.add(flowerV2Group);
scene.add(wavesGroup);
scene.add(spheresGroup);

const groups: PatternGroups = {
  flowerGroup,
  flowerV2Group,
  wavesGroup,
  spheresGroup,
};

// Setup controls
setupResizeHandler();
setupKeyboardControls(state, groups, camera, controls);
setupPauseButton(state);
initInteraction();

// Initialize to first pattern
switchPattern(PATTERNS.FLOWER_V2, state, groups, camera, controls);

// Animation loop
const clock = new Clock();
let animationTime = 0;
let lastTime = 0;

function animate(): void {
  requestAnimationFrame(animate);

  const currentTime = clock.getElapsedTime();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  if (!state.isPaused) {
    animationTime += deltaTime;
  }

  if (state.currentPattern === PATTERNS.FLOWER) {
    animateFlowerOfLife(flowerGroup, animationTime);
  }

  if (state.currentPattern === PATTERNS.FLOWER_V2) {
    animateFlowerOfLifeV2(flowerV2Group, animationTime);
    updateHover(camera, flowerV2Group);
  } else {
    clearHover();
  }

  if (state.currentPattern === PATTERNS.WAVES) {
    animateHarmonicWaves(waves as WaveData[], animationTime);
  }

  if (state.currentPattern === PATTERNS.SPHERES) {
    animateSpheres3D(spheresGroup, animationTime);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
