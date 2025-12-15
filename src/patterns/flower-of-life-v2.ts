import { BufferGeometry, BufferAttribute, LineBasicMaterial, Line, Group } from 'three'
import { CONFIG } from '../config'

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

function addSurroundingCircles(
  group: Group,
  centerX: number,
  centerY: number,
  radius: number,
  existingPositions: Set<string>
): { x: number; y: number }[] {
  const newCircles: { x: number; y: number }[] = []

  // Add 6 circles around the center point at 60° intervals
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 // 0, 60°, 120°, 180°, 240°, 300°
    const circleCenterX = centerX + radius * Math.cos(angle)
    const circleCenterY = centerY + radius * Math.sin(angle)

    const key = positionKey(circleCenterX, circleCenterY)
    if (existingPositions.has(key)) {
      continue
    }
    existingPositions.add(key)

    // Start angle: each circle starts from where it intersects the previous circle
    // The intersection with the previous circle is at angle + 120°
    const startAngle = angle + (2 * Math.PI) / 3

    const circle = createCircle(circleCenterX, circleCenterY, radius, CONFIG.circleSegments, startAngle)
    group.add(circle)
    newCircles.push({ x: circleCenterX, y: circleCenterY })
  }

  return newCircles
}

export function createFlowerOfLifeV2(): Group {
  const group = new Group()
  const radius = CONFIG.circleRadius
  const existingPositions = new Set<string>()

  // Circle 1: center at origin
  const circle1 = createCircle(0, 0, radius, CONFIG.circleSegments)
  group.add(circle1)
  existingPositions.add(positionKey(0, 0))

  // First ring: 6 circles around the center
  const firstRing = addSurroundingCircles(group, 0, 0, radius, existingPositions)

  // Second ring: add circles around each circle in the first ring
  for (const pos of firstRing) {
    addSurroundingCircles(group, pos.x, pos.y, radius, existingPositions)
  }

  return group
}

export function animateFlowerOfLifeV2(group: Group, time: number): void {
  const segments = CONFIG.circleSegments
  const drawDuration = CONFIG.flowerV2DrawDuration
  const pauseDuration = CONFIG.flowerV2PauseDuration
  const numCircles = group.children.length

  // Total cycle: draw all circles + pause (only at end)
  const totalCycle = drawDuration * numCircles + pauseDuration
  const cycleTime = time % totalCycle

  // Animate each circle
  for (let i = 0; i < numCircles; i++) {
    const circle = group.children[i] as Line
    const geometry = circle.geometry as BufferGeometry
    const circleStartTime = drawDuration * i
    const circleEndTime = drawDuration * (i + 1)

    let progress: number
    if (cycleTime < circleStartTime) {
      progress = 0
    } else if (cycleTime < circleEndTime) {
      progress = (cycleTime - circleStartTime) / drawDuration
    } else {
      progress = 1
    }
    geometry.setDrawRange(0, Math.floor(progress * (segments + 1)))
  }
}
