import {
  SphereGeometry,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Mesh,
  Group,
} from 'three'
import type { Material } from 'three'
import { CONFIG, type SphereStyle } from '../config'
import { get3DFlowerPositions } from '../utils/geometry'

function createSphere(
  x: number,
  y: number,
  z: number,
  radius: number,
  style: SphereStyle
): Mesh {
  const geometry = new SphereGeometry(radius, CONFIG.sphereSegments, CONFIG.sphereSegments)
  let material: Material

  switch (style) {
    case 'wireframe':
      material = new MeshBasicMaterial({
        color: CONFIG.lineColor,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      })
      break
    case 'glass':
      material = new MeshPhysicalMaterial({
        color: CONFIG.lineColor,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        thickness: 0.5
      })
      break
    case 'solid':
    default:
      material = new MeshStandardMaterial({
        color: CONFIG.lineColor,
        roughness: 0.4,
        metalness: 0.2
      })
  }

  const sphere = new Mesh(geometry, material)
  sphere.position.set(x, y, z)
  return sphere
}

export function createSpheres3D(style: SphereStyle): Group {
  const group = new Group()

  const positions = get3DFlowerPositions(
    CONFIG.sphere3dRings,
    CONFIG.sphereRadius * 2,
    CONFIG.sphereLayers,
    CONFIG.layerSpacing
  )

  for (const pos of positions) {
    const sphere = createSphere(pos.x, pos.y, pos.z, CONFIG.sphereRadius, style)
    group.add(sphere)
  }

  return group
}

export function rebuildSpheres3D(group: Group, style: SphereStyle): void {
  // Clear existing spheres
  while (group.children.length > 0) {
    const child = group.children[0] as Mesh
    child.geometry.dispose()
    if (Array.isArray(child.material)) {
      child.material.forEach((m) => m.dispose())
    } else {
      child.material.dispose()
    }
    group.remove(child)
  }

  const positions = get3DFlowerPositions(
    CONFIG.sphere3dRings,
    CONFIG.sphereRadius * 2,
    CONFIG.sphereLayers,
    CONFIG.layerSpacing
  )

  for (const pos of positions) {
    const sphere = createSphere(pos.x, pos.y, pos.z, CONFIG.sphereRadius, style)
    group.add(sphere)
  }
}

export function animateSpheres3D(group: Group, time: number): void {
  group.rotation.y = time * CONFIG.sphere3dRotationSpeed * 0.5
}
