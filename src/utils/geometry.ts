export interface Position2D {
  x: number
  y: number
}

export interface Position3D {
  x: number
  y: number
  z: number
}

/**
 * Generate hexagonal grid positions for the Flower of Life pattern.
 * Returns positions centered at origin with circles placed at distance = radius.
 */
export function getFlowerPositions(rings: number, radius: number): Position2D[] {
  const positions: Position2D[] = []

  // Center circle
  positions.push({ x: 0, y: 0 })

  // For the Flower of Life, circles are placed at distance = radius
  // Using axial coordinates for hexagonal grid
  for (let ring = 1; ring <= rings; ring++) {
    // Each ring has 6 * ring circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 // 60 degree intervals

      // Walk along the edge of the hexagon
      for (let j = 0; j < ring; j++) {
        const nextAngle = ((i + 2) * Math.PI) / 3

        // Start position for this edge
        const startX = ring * radius * Math.cos(angle)
        const startY = ring * radius * Math.sin(angle)

        // Direction along edge
        const dx = radius * Math.cos(nextAngle)
        const dy = radius * Math.sin(nextAngle)

        const x = startX + j * dx
        const y = startY + j * dy

        positions.push({ x, y })
      }
    }
  }

  return positions
}

/**
 * Generate 3D hexagonal close-packed positions for the sphere pattern.
 * Alternate layers are offset for close-packing effect.
 */
export function get3DFlowerPositions(
  rings: number,
  spacing: number,
  layers: number,
  layerSpacing: number
): Position3D[] {
  const positions: Position3D[] = []

  for (let layer = 0; layer < layers; layer++) {
    const zOffset = layer * layerSpacing
    // Alternate layers are offset for close-packing
    const layerPositions = getFlowerPositions(rings, spacing)

    for (const pos of layerPositions) {
      positions.push({
        x: pos.x + (layer % 2 === 1 ? spacing * 0.5 : 0),
        y: pos.y + (layer % 2 === 1 ? (spacing * Math.sqrt(3)) / 6 : 0),
        z: zOffset
      })
    }
  }

  // Center vertically
  const centerZ = ((layers - 1) * layerSpacing) / 2
  return positions.map((p) => ({ ...p, z: p.z - centerZ }))
}

/**
 * Calculate the expected number of circles for a given number of rings.
 * Ring 0 = 1 circle (center)
 * Ring n adds 6*n circles
 * Total = 1 + 6*(1 + 2 + ... + n) = 1 + 6*n*(n+1)/2 = 1 + 3*n*(n+1)
 */
export function getExpectedCircleCount(rings: number): number {
  return 1 + 3 * rings * (rings + 1)
}
