import { Raycaster, Vector2, Camera, Group, Line, LineBasicMaterial, Color } from 'three'
import { CONFIG } from './config'

const raycaster = new Raycaster()
const mouse = new Vector2()

// Line threshold for easier hover detection (lines are thin)
raycaster.params.Line!.threshold = 0.1

let currentlyHovered: Line | null = null
const originalColor = new Color(CONFIG.lineColor)
const hoverColor = new Color(CONFIG.flowerV2HoverColor)

export function initInteraction(): void {
  window.addEventListener('mousemove', onMouseMove)
}

function onMouseMove(event: MouseEvent): void {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

export function updateHover(camera: Camera, group: Group): void {
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(group.children, false)
  const firstIntersect = intersects[0]

  const hoveredLine = firstIntersect ? (firstIntersect.object as Line) : null

  // If we're hovering a different object (or none)
  if (hoveredLine !== currentlyHovered) {
    // Restore previous hovered object's color
    if (currentlyHovered) {
      const material = currentlyHovered.material as LineBasicMaterial
      material.color.copy(originalColor)
    }

    // Set new hovered object's color
    if (hoveredLine) {
      const material = hoveredLine.material as LineBasicMaterial
      material.color.copy(hoverColor)
    }

    currentlyHovered = hoveredLine
  }
}

export function clearHover(): void {
  if (currentlyHovered) {
    const material = currentlyHovered.material as LineBasicMaterial
    material.color.copy(originalColor)
    currentlyHovered = null
  }
}
