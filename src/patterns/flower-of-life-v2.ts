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

export function createFlowerOfLifeV2(): Group {
  const group = new Group()
  const radius = CONFIG.circleRadius

  // Circle 1: center at origin
  const circle1 = createCircle(0, 0, radius, CONFIG.circleSegments)
  group.add(circle1)

  // Circle 2: center on circumference of circle 1 (at angle 0, i.e. right side)
  // The two circles intersect at angles ±60° from the center-to-center line
  // From circle 2's perspective, these intersection points are at angles 120° and 240° (2π/3 and 4π/3)
  // Start drawing from the upper intersection point (angle 2π/3 = 120°)
  const circle2 = createCircle(radius, 0, radius, CONFIG.circleSegments, (2 * Math.PI) / 3)
  group.add(circle2)

  return group
}

export function animateFlowerOfLifeV2(group: Group, time: number): void {
  const segments = CONFIG.circleSegments
  const drawDuration = CONFIG.flowerV2DrawDuration
  const pauseDuration = CONFIG.flowerV2PauseDuration

  // Total cycle: draw circle1 + draw circle2 + pause (only at end)
  const totalCycle = drawDuration * 2 + pauseDuration
  const cycleTime = time % totalCycle

  // Circle 1
  const circle1 = group.children[0] as Line
  const geometry1 = circle1.geometry as BufferGeometry
  let progress1: number
  if (cycleTime < drawDuration) {
    progress1 = cycleTime / drawDuration
  } else {
    progress1 = 1
  }
  geometry1.setDrawRange(0, Math.floor(progress1 * (segments + 1)))

  // Circle 2
  const circle2 = group.children[1] as Line
  const geometry2 = circle2.geometry as BufferGeometry
  let progress2: number
  if (cycleTime < drawDuration) {
    progress2 = 0
  } else if (cycleTime < drawDuration * 2) {
    progress2 = (cycleTime - drawDuration) / drawDuration
  } else {
    progress2 = 1
  }
  geometry2.setDrawRange(0, Math.floor(progress2 * (segments + 1)))
}
