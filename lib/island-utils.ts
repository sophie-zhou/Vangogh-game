// Utility functions for island management

export interface IslandItem {
  id: string
  type: "animal" | "decoration" | "building"
  name: string
  sprite: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  animation?: string
  owned: boolean
  rarity?: "common" | "rare" | "epic" | "legendary"
}

export class IslandManager {
  // Check if a position is valid for placement
  static isValidPlacement(
    x: number,
    y: number,
    islandBounds = { centerX: 50, centerY: 50, radiusX: 45, radiusY: 35 },
  ): boolean {
    const { centerX, centerY, radiusX, radiusY } = islandBounds

    const normalizedX = (x - centerX) / radiusX
    const normalizedY = (y - centerY) / radiusY

    // Check if point is within elliptical island bounds
    return normalizedX * normalizedX + normalizedY * normalizedY <= 1
  }

  // Check for item collisions
  static checkCollision(newItem: IslandItem, existingItems: IslandItem[]): boolean {
    return existingItems.some((item) => {
      const distance = Math.sqrt(Math.pow(newItem.x - item.x, 2) + Math.pow(newItem.y - item.y, 2))
      const minDistance = (newItem.width + item.width) / 4 // Minimum separation
      return distance < minDistance
    })
  }

  // Get optimal placement position
  static getOptimalPlacement(
    preferredX: number,
    preferredY: number,
    item: IslandItem,
    existingItems: IslandItem[],
  ): { x: number; y: number } {
    // Try preferred position first
    if (
      this.isValidPlacement(preferredX, preferredY) &&
      !this.checkCollision({ ...item, x: preferredX, y: preferredY }, existingItems)
    ) {
      return { x: preferredX, y: preferredY }
    }

    // Search in expanding circles for valid position
    for (let radius = 5; radius <= 30; radius += 5) {
      for (let angle = 0; angle < 360; angle += 30) {
        const x = preferredX + radius * Math.cos((angle * Math.PI) / 180)
        const y = preferredY + radius * Math.sin((angle * Math.PI) / 180)

        if (this.isValidPlacement(x, y) && !this.checkCollision({ ...item, x, y }, existingItems)) {
          return { x, y }
        }
      }
    }

    // Fallback to center if no position found
    return { x: 50, y: 50 }
  }

  // Calculate island happiness/beauty score
  static calculateIslandScore(items: IslandItem[]): number {
    let score = 0

    // Base points for each item type
    items.forEach((item) => {
      switch (item.type) {
        case "animal":
          score += 10
          break
        case "decoration":
          score += 5
          break
        case "building":
          score += 15
          break
      }

      // Rarity bonus
      switch (item.rarity) {
        case "rare":
          score += 5
          break
        case "epic":
          score += 10
          break
        case "legendary":
          score += 20
          break
      }
    })

    // Diversity bonus
    const types = new Set(items.map((item) => item.type))
    score += types.size * 5

    // Quantity bonus
    if (items.length >= 5) score += 10
    if (items.length >= 10) score += 20

    return score
  }

  // Generate random weather effects
  static getWeatherEffect(timeOfDay: "day" | "night"): {
    type: "sunny" | "cloudy" | "starry" | "aurora"
    intensity: number
  } {
    const effects =
      timeOfDay === "day"
        ? [
            { type: "sunny" as const, intensity: 0.8 },
            { type: "cloudy" as const, intensity: 0.6 },
          ]
        : [
            { type: "starry" as const, intensity: 0.9 },
            { type: "aurora" as const, intensity: 0.4 },
          ]

    return effects[Math.floor(Math.random() * effects.length)]
  }

  // Save island state to localStorage
  static saveIslandState(items: IslandItem[], islandName = "default"): void {
    const state = {
      items,
      lastSaved: Date.now(),
      version: "1.0",
    }
    localStorage.setItem(`island_${islandName}`, JSON.stringify(state))
  }

  // Load island state from localStorage
  static loadIslandState(islandName = "default"): IslandItem[] | null {
    try {
      const saved = localStorage.getItem(`island_${islandName}`)
      if (saved) {
        const state = JSON.parse(saved)
        return state.items || []
      }
    } catch (error) {
      console.error("Failed to load island state:", error)
    }
    return null
  }
}
