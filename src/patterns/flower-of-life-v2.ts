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

  // Circles 2-7: 6 circles around the center, each centered on circle 1's circumference
  // They are placed at 60° intervals (0°, 60°, 120°, 180°, 240°, 300°)
  // Each circle starts drawing from the intersection point with the previous circle
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 // 0, 60°, 120°, 180°, 240°, 300°
    const centerX = radius * Math.cos(angle)
    const centerY = radius * Math.sin(angle)

    // Start angle: each circle starts from where it intersects the previous circle
    // The intersection with the previous circle (or with circle 1 for the first) is at angle + 120°
    const startAngle = angle + (2 * Math.PI) / 3

    const circle = createCircle(centerX, centerY, radius, CONFIG.circleSegments, startAngle)
    group.add(circle)
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
