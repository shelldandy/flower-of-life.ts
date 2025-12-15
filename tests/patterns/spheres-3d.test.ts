import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Group, Mesh, MeshStandardMaterial, MeshBasicMaterial, MeshPhysicalMaterial } from 'three'

beforeEach(() => {
  vi.stubGlobal('document', {
    createElement: () => ({
      getContext: () => null,
      style: {}
    }),
    body: {
      appendChild: vi.fn()
    }
  })
})

describe('createSpheres3D', () => {
  it('creates a THREE.Group', async () => {
    const { createSpheres3D } = await import('../../src/patterns/spheres-3d')
    const group = createSpheres3D('solid')
    expect(group).toBeInstanceOf(Group)
  })

  it('creates Mesh objects', async () => {
    const { createSpheres3D } = await import('../../src/patterns/spheres-3d')
    const group = createSpheres3D('solid')

    expect(group.children.length).toBeGreaterThan(0)
    for (const child of group.children) {
      expect(child).toBeInstanceOf(Mesh)
    }
  })

  it('creates correct number of spheres', async () => {
    const { createSpheres3D } = await import('../../src/patterns/spheres-3d')
    const { CONFIG } = await import('../../src/config')
    const { getExpectedCircleCount } = await import('../../src/utils/geometry')

    const group = createSpheres3D('solid')
    const expectedPerLayer = getExpectedCircleCount(CONFIG.sphere3dRings)
    const expectedTotal = expectedPerLayer * CONFIG.sphereLayers

    expect(group.children).toHaveLength(expectedTotal)
  })

  it('creates different materials for different styles', async () => {
    const { createSpheres3D } = await import('../../src/patterns/spheres-3d')

    const solidGroup = createSpheres3D('solid')
    const wireframeGroup = createSpheres3D('wireframe')
    const glassGroup = createSpheres3D('glass')

    const solidMesh = solidGroup.children[0] as Mesh
    const wireframeMesh = wireframeGroup.children[0] as Mesh
    const glassMesh = glassGroup.children[0] as Mesh

    expect(solidMesh.material).toBeInstanceOf(MeshStandardMaterial)
    expect(wireframeMesh.material).toBeInstanceOf(MeshBasicMaterial)
    expect(glassMesh.material).toBeInstanceOf(MeshPhysicalMaterial)
  })
})

describe('rebuildSpheres3D', () => {
  it('clears existing spheres and creates new ones', async () => {
    const { createSpheres3D, rebuildSpheres3D } = await import('../../src/patterns/spheres-3d')
    const group = createSpheres3D('solid')
    const initialCount = group.children.length

    rebuildSpheres3D(group, 'wireframe')

    // Same count of children
    expect(group.children).toHaveLength(initialCount)

    // But with different material type
    const mesh = group.children[0] as Mesh
    expect(mesh.material).toBeInstanceOf(MeshBasicMaterial)
  })
})

describe('animateSpheres3D', () => {
  it('rotates the group based on time', async () => {
    const { createSpheres3D, animateSpheres3D } = await import('../../src/patterns/spheres-3d')
    const group = createSpheres3D('solid')

    animateSpheres3D(group, 0)
    expect(group.rotation.y).toBe(0)

    animateSpheres3D(group, 1)
    expect(group.rotation.y).not.toBe(0)
  })
})
