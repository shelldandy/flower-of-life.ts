import * as THREE from 'three'
import { CONFIG, type SphereStyle } from '../config'
import { get3DFlowerPositions } from '../utils/geometry'

function createSphere(
  x: number,
  y: number,
  z: number,
  radius: number,
  style: SphereStyle
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius, CONFIG.sphereSegments, CONFIG.sphereSegments)
  let material: THREE.Material

  switch (style) {
    case 'wireframe':
      material = new THREE.MeshBasicMaterial({
        color: CONFIG.lineColor,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      })
      break
    case 'glass':
      material = new THREE.MeshPhysicalMaterial({
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
      material = new THREE.MeshStandardMaterial({
        color: CONFIG.lineColor,
        roughness: 0.4,
        metalness: 0.2
      })
  }

  const sphere = new THREE.Mesh(geometry, material)
  sphere.position.set(x, y, z)
  return sphere
}

export function createSpheres3D(style: SphereStyle): THREE.Group {
  const group = new THREE.Group()

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

export function rebuildSpheres3D(group: THREE.Group, style: SphereStyle): void {
  // Clear existing spheres
  while (group.children.length > 0) {
    const child = group.children[0] as THREE.Mesh
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

export function animateSpheres3D(group: THREE.Group, time: number): void {
  group.rotation.y = time * CONFIG.sphere3dRotationSpeed * 0.5
}
