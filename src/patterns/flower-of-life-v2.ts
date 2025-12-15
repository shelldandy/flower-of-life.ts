import { BufferGeometry, BufferAttribute, LineBasicMaterial, Line, Group } from 'three'
import { CONFIG } from '../config'

function createCircle(
  centerX: number,
  centerY: number,
  radius: number,
  segments: number
): Line {
  const geometry = new BufferGeometry()
  const positions = new Float32Array((segments + 1) * 3)

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
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
  const circle = createCircle(0, 0, CONFIG.circleRadius, CONFIG.circleSegments)
  group.add(circle)
  return group
}

export function animateFlowerOfLifeV2(group: Group, time: number): void {
  const circle = group.children[0] as Line
  const geometry = circle.geometry as BufferGeometry
  const segments = CONFIG.circleSegments

  const cycleDuration = CONFIG.flowerV2DrawDuration + CONFIG.flowerV2PauseDuration
  const cycleTime = time % cycleDuration

  let progress: number
  if (cycleTime < CONFIG.flowerV2DrawDuration) {
    progress = cycleTime / CONFIG.flowerV2DrawDuration
  } else {
    progress = 1
  }

  const drawCount = Math.floor(progress * (segments + 1))
  geometry.setDrawRange(0, drawCount)
}
