// This file will store your painting data structure
export interface PaintingQuestion {
  id: string
  title: string
  year: string
  realImagePath: string
  fakeImagePath: string
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  points: number
  description: string
  techniques: string[]
  location?: string
  isActive: boolean
}

// Default paintings data - replace with your imported data
export const defaultPaintings: PaintingQuestion[] = [
  {
    id: "1",
    title: "The Starry Night",
    year: "1889",
    realImagePath: "/paintings/real/starry-night.jpg",
    fakeImagePath: "/paintings/fake/starry-night-ai.jpg",
    difficulty: "Medium",
    points: 20,
    description: "Van Gogh's most famous painting, created during his stay at the asylum in Saint-Rémy-de-Provence.",
    techniques: ["Impasto", "Post-Impressionism", "Swirling brushstrokes"],
    location: "Saint-Rémy-de-Provence",
    isActive: true,
  },
  // Add more paintings here...
]

// Function to load paintings from localStorage or use defaults
export function loadPaintings(): PaintingQuestion[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("vangogh-paintings")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error("Error parsing stored paintings:", error)
      }
    }
  }
  return defaultPaintings
}

// Function to save paintings to localStorage
export function savePaintings(paintings: PaintingQuestion[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("vangogh-paintings", JSON.stringify(paintings))
  }
}
