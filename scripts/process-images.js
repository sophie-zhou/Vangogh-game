// Node.js script to help organize your extracted images
// Run this after extracting your ZIP files

const fs = require("fs").promises
const path = require("path")

async function organizeImages() {
  const sourceDir = "./extracted-images" // Your extracted ZIP folder
  const realDir = "./public/paintings/real"
  const aiDir = "./public/paintings/ai"

  try {
    // Create directories if they don't exist
    await fs.mkdir(realDir, { recursive: true })
    await fs.mkdir(aiDir, { recursive: true })

    // Read all files from source directory
    const files = await fs.readdir(sourceDir)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file))

    console.log(`Found ${imageFiles.length} image files`)

    let realCount = 0
    let aiCount = 0

    for (const file of imageFiles) {
      const sourcePath = path.join(sourceDir, file)

      // Determine if it's real or AI based on filename patterns
      // Adjust these patterns based on your naming convention
      const isAI =
        file.toLowerCase().includes("ai") ||
        file.toLowerCase().includes("generated") ||
        file.toLowerCase().includes("fake") ||
        file.toLowerCase().includes("synthetic")

      const destDir = isAI ? aiDir : realDir
      const destPath = path.join(destDir, file)

      // Copy file to appropriate directory
      await fs.copyFile(sourcePath, destPath)

      if (isAI) {
        aiCount++
        console.log(`✓ AI: ${file}`)
      } else {
        realCount++
        console.log(`✓ Real: ${file}`)
      }
    }

    console.log(`\n📊 Processing complete:`)
    console.log(`   Real images: ${realCount}`)
    console.log(`   AI images: ${aiCount}`)
    console.log(`   Total processed: ${realCount + aiCount}`)
  } catch (error) {
    console.error("Error organizing images:", error)
  }
}

// Run the script
organizeImages()
