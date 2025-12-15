export const CONFIG = {
  // Shared
  backgroundColor: 0x2a2525,
  lineColor: 0xf5f5f0,

  // Flower of Life
  flowerRings: 3,
  circleRadius: 1.5,
  circleSegments: 64,
  pulseSpeed: 0.5,
  pulseAmount: 0.05,

  // Harmonic Waves
  numHarmonics: 16,
  waveSegments: 256,
  waveWidth: 10,
  verticalSpacing: 0.6,
  baseAmplitude: 1.0,
  waveAnimationSpeed: 0.3,

  // Flower of Life v2
  flowerV2Rings: 3,
  flowerV2DrawDuration: 1,
  flowerV2PauseDuration: 5,
  flowerV2HoverColor: 0xffaa00,

  // 3D Flower of Life (Spheres)
  sphere3dRings: 2,
  sphereRadius: 0.8,
  sphereSegments: 32,
  sphereLayers: 3,
  layerSpacing: 1.4,
  sphere3dRotationSpeed: 0.3,
} as const;

export type Config = typeof CONFIG;

export const PATTERNS = {
  FLOWER: "flower",
  FLOWER_V2: "flower-v2",
  WAVES: "waves",
  SPHERES: "spheres",
} as const;

export type Pattern = (typeof PATTERNS)[keyof typeof PATTERNS];

export const SPHERE_STYLES = ["solid", "wireframe", "glass"] as const;

export type SphereStyle = (typeof SPHERE_STYLES)[number];
