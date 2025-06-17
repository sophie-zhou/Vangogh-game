// Utility functions for handling large image datasets

export interface ImageProcessingResult {
  processed: number
  errors: string[]
  duplicates: string[]
}

export class ImageProcessor {
  private static readonly SUPPORTED_FORMATS = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  static async processImageBatch(files: FileList): Promise<ImageProcessingResult> {
    const result: ImageProcessingResult = {
      processed: 0,
      errors: [],
      duplicates: [],
    }

    const processedNames = new Set<string>()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      try {
        // Check file type
        if (!this.isValidImageFile(file)) {
          result.errors.push(`${file.name}: Unsupported file type`)
          continue
        }

        // Check file size
        if (file.size > this.MAX_FILE_SIZE) {
          result.errors.push(`${file.name}: File too large (${Math.round(file.size / 1024 / 1024)}MB)`)
          continue
        }

        // Check for duplicates
        if (processedNames.has(file.name)) {
          result.duplicates.push(file.name)
          continue
        }

        processedNames.add(file.name)
        result.processed++
      } catch (error) {
        result.errors.push(`${file.name}: Processing error`)
      }
    }

    return result
  }

  static isValidImageFile(file: File): boolean {
    const extension = file.name.split(".").pop()?.toLowerCase()
    return extension ? this.SUPPORTED_FORMATS.includes(extension) : false
  }

  static categorizeByFilename(filename: string): "real" | "ai" | "unknown" {
    const name = filename.toLowerCase()

    // AI indicators
    if (
      name.includes("ai") ||
      name.includes("generated") ||
      name.includes("fake") ||
      name.includes("synthetic") ||
      name.includes("artificial")
    ) {
      return "ai"
    }

    // Real indicators
    if (name.includes("real") || name.includes("original") || name.includes("authentic") || name.includes("vangogh")) {
      return "real"
    }

    return "unknown"
  }

  static extractPaintingTitle(filename: string): string {
    return filename
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[-_]/g, " ") // Replace dashes/underscores with spaces
      .replace(/\b(ai|generated|fake|real|original)\b/gi, "") // Remove category words
      .replace(/\s+/g, " ") // Normalize spaces
      .trim()
      .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize
  }

  static findMatchingPairs(
    realImages: string[],
    aiImages: string[],
  ): Array<{ real: string; ai: string; confidence: number }> {
    const pairs: Array<{ real: string; ai: string; confidence: number }> = []

    for (const realImg of realImages) {
      const realTitle = this.extractPaintingTitle(realImg)
      let bestMatch = { ai: "", confidence: 0 }

      for (const aiImg of aiImages) {
        const aiTitle = this.extractPaintingTitle(aiImg)
        const confidence = this.calculateSimilarity(realTitle, aiTitle)

        if (confidence > bestMatch.confidence && confidence > 0.6) {
          bestMatch = { ai: aiImg, confidence }
        }
      }

      if (bestMatch.ai) {
        pairs.push({ real: realImg, ai: bestMatch.ai, confidence: bestMatch.confidence })
      }
    }

    return pairs.sort((a, b) => b.confidence - a.confidence)
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const distance = this.levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
      }
    }

    return matrix[str2.length][str1.length]
  }
}
