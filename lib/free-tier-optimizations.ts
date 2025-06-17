"use client"

import { useEffect } from "react"

import { useState } from "react"

// Optimizations specifically for free tier deployments

export class FreeTierOptimizer {
  // Compress images for Vercel free tier
  static async optimizeForVercel(imageFile: File): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calculate optimal dimensions (max 800px width)
        const maxWidth = 800
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)

        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            resolve(blob!)
          },
          "image/webp",
          0.75,
        ) // 75% quality WebP
      }

      img.src = URL.createObjectURL(imageFile)
    })
  }

  // Calculate bandwidth usage for Vercel
  static calculateBandwidthUsage(
    imageCount: number,
    avgImageSize: number,
  ): {
    totalSize: number
    monthlyUsers: number
    dailyUsers: number
  } {
    const totalSize = imageCount * avgImageSize // in bytes
    const vercelLimit = 100 * 1024 * 1024 * 1024 // 100GB in bytes

    const monthlyUsers = Math.floor(vercelLimit / totalSize)
    const dailyUsers = Math.floor(monthlyUsers / 30)

    return {
      totalSize,
      monthlyUsers,
      dailyUsers,
    }
  }

  // Generate static data for GitHub Pages
  static generateStaticData(paintings: any[]): string {
    return `// Auto-generated paintings data for GitHub Pages
export const paintingsData = ${JSON.stringify(paintings, null, 2)};

export function getRandomPainting() {
  const activePaintings = paintingsData.filter(p => p.isActive);
  if (activePaintings.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * activePaintings.length);
  return activePaintings[randomIndex];
}

export function getPaintingsByDifficulty(difficulty) {
  return paintingsData.filter(p => p.difficulty === difficulty && p.isActive);
}`
  }

  // Create image manifest for lazy loading
  static createImageManifest(paintings: any[]): string {
    const manifest = paintings.reduce((acc, painting) => {
      acc[painting.id] = {
        real: painting.realImagePath,
        ai: painting.fakeImagePath,
        preload: painting.difficulty === "Easy", // Preload easy images
      }
      return acc
    }, {})

    return `export const imageManifest = ${JSON.stringify(manifest, null, 2)};`
  }
}

// Hook for progressive image loading
export function useProgressiveImage(src: string) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState("")

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setImageLoaded(true)
    }
    img.src = src
  }, [src])

  return { imageLoaded, imageSrc }
}
