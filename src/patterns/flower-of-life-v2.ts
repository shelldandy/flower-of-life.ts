import { BufferGeometry, BufferAttribute, LineBasicMaterial, Line, Group } from 'three'
import { CONFIG } from '../config'

// The Seven Movements of creation - timing thresholds calculated once
let seedTimings: { start: number; end: number }[] = []
let seedTotalDuration = 0
let totalCycleDuration = 0

function calculateTimings(numCircles: number): void {
  const durations = CONFIG.flowerV2StageDurations
  const pauses = CONFIG.flowerV2StagePauses

  seedTimings = []
  let currentTime = 0

  // First 7 circles: Seed of Life with staged timing
  for (let i = 0; i < 7; i++) {
    const start = currentTime
    const end = start + (durations[i] ?? 0.5)
    seedTimings.push({ start, end })
    currentTime = end + (pauses[i] ?? 0.2)
  }

  seedTotalDuration = currentTime

  // Outer circles draw after the Seed
  const outerCircles = numCircles - 7
  const outerDuration = outerCircles * CONFIG.flowerV2OuterDrawDuration

  totalCycleDuration = seedTotalDuration + outerDuration + CONFIG.flowerV2FinalPause
}

function createCircle(
  centerX: number,
  centerY: number,
  radius: number,
  segments: number,
  startAngle: number = 0
): Line {
  const geometry = new BufferGeometry()
  const positions = new Float32Array((segments + 1) * 3)

  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (i / segments) * Math.PI * 2
    positions[i * 3] = centerX + radius * Math.cos(angle)
    positions[i * 3 + 1] = centerY + radius * Math.sin(angle)
    positions[i * 3 + 2] = 0
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3))

  const material = new LineBasicMaterial({
    color: CONFIG.lineColor,
    transparent: true,
    opacity: 0.8
  })

  return new Line(geometry, material)
}

// Round to avoid floating point comparison issues
function positionKey(x: number, y: number): string {
  const precision = 1000
  return `${Math.round(x * precision)},${Math.round(y * precision)}`
}

function findSurroundingCirclePositions(
  centerX: number,
  centerY: number,
  radius: number,
  existingPositions: Set<string>
): { x: number; y: number }[] {
  const newCircles: { x: number; y: number }[] = []

  // Find 6 circle positions around the center point at 60° intervals
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 // 0, 60°, 120°, 180°, 240°, 300°
    const circleCenterX = centerX + radius * Math.cos(angle)
    const circleCenterY = centerY + radius * Math.sin(angle)

    const key = positionKey(circleCenterX, circleCenterY)
    if (existingPositions.has(key)) {
      continue
    }
    existingPositions.add(key)

    newCircles.push({ x: circleCenterX, y: circleCenterY })
  }

  return newCircles
}

function addCircleAtPosition(group: Group, x: number, y: number, radius: number): void {
  // Start angle: circle starts from the point closest to origin
  // This makes circles draw "outward" from the center of the pattern
  const angleFromOrigin = Math.atan2(y, x)
  const startAngle = angleFromOrigin + Math.PI // Start from the side facing the origin

  const circle = createCircle(x, y, radius, CONFIG.circleSegments, startAngle)
  group.add(circle)
}

export function createFlowerOfLifeV2(): Group {
  const group = new Group()
  const radius = CONFIG.circleRadius
  const existingPositions = new Set<string>()

  // Circle 1: center at origin
  const circle1 = createCircle(0, 0, radius, CONFIG.circleSegments)
  group.add(circle1)
  existingPositions.add(positionKey(0, 0))

  // Start with center as the only "previous ring"
  let previousRing = [{ x: 0, y: 0 }]

  // Add rings iteratively
  for (let ring = 0; ring < CONFIG.flowerV2Rings; ring++) {
    // Collect all new circle positions for this ring
    const newRing: { x: number; y: number }[] = []
    for (const pos of previousRing) {
      const added = findSurroundingCirclePositions(pos.x, pos.y, radius, existingPositions)
      newRing.push(...added)
    }

    // Sort by angle from origin so circles draw in consistent counter-clockwise order
    newRing.sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x))

    // Add circles in sorted order
    for (const pos of newRing) {
      addCircleAtPosition(group, pos.x, pos.y, radius)
    }

    previousRing = newRing
  }

  return group
}

export function animateFlowerOfLifeV2(group: Group, time: number): void {
  const segments = CONFIG.circleSegments
  const numCircles = group.children.length

  // Calculate timings once (or when circle count changes)
  if (seedTimings.length === 0 || totalCycleDuration === 0) {
    calculateTimings(numCircles)
  }

  const cycleTime = time % totalCycleDuration

  // Animate each circle
  for (let i = 0; i < numCircles; i++) {
    const circle = group.children[i] as Line
    const geometry = circle.geometry as BufferGeometry

    let progress: number

    if (i < 7) {
      // Seed of Life: staged timing with pauses
      const timing = seedTimings[i]!
      const { start, end } = timing
      const duration = end - start

      if (cycleTime < start) {
        progress = 0
      } else if (cycleTime < end) {
        progress = (cycleTime - start) / duration
      } else {
        progress = 1
      }
    } else {
      // Outer rings: uniform fast timing after Seed completes
      const outerIndex = i - 7
      const outerStart = seedTotalDuration + outerIndex * CONFIG.flowerV2OuterDrawDuration
      const outerEnd = outerStart + CONFIG.flowerV2OuterDrawDuration

      if (cycleTime < outerStart) {
        progress = 0
      } else if (cycleTime < outerEnd) {
        progress = (cycleTime - outerStart) / CONFIG.flowerV2OuterDrawDuration
      } else {
        progress = 1
      }
    }

    geometry.setDrawRange(0, Math.floor(progress * (segments + 1)))
  }
}
