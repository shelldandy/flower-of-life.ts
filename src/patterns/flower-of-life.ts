import { BufferGeometry, BufferAttribute, LineBasicMaterial, Line, Group } from 'three'
import { CONFIG } from '../config'
import { getFlowerPositions } from '../utils/geometry'

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

export function createFlowerOfLife(): Group {
  const group = new Group()
  const positions = getFlowerPositions(CONFIG.flowerRings, CONFIG.circleRadius)

  for (const pos of positions) {
    const circle = createCircle(pos.x, pos.y, CONFIG.circleRadius, CONFIG.circleSegments)
    group.add(circle)
  }

  return group
}

export function animateFlowerOfLife(group: Group, time: number): void {
  const pulseScale = 1 + Math.sin(time * CONFIG.pulseSpeed) * CONFIG.pulseAmount
  group.scale.set(pulseScale, pulseScale, 1)
}
