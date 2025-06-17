"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FolderOpen, Download, Trash2, Eye, CheckCircle } from "lucide-react"
import Image from "next/image"

interface ImageFile {
  id: string
  name: string
  file: File
  preview: string
  type: "real" | "ai"
}

interface PaintingPair {
  id: string
  title: string
  year: string
  realImage: ImageFile
  aiImage: ImageFile
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  description: string
}

export default function DataManagerPage() {
  const [realImages, setRealImages] = useState<ImageFile[]>([])
  const [aiImages, setAiImages] = useState<ImageFile[]>([])
  const [paintingPairs, setPaintingPairs] = useState<PaintingPair[]>([])
  const [dragActive, setDragActive] = useState<"real" | "ai" | null>(null)
  const [processing, setProcessing] = useState(false)

  const realDropRef = useRef<HTMLDivElement>(null)
  const aiDropRef = useRef<HTMLDivElement>(null)

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent, type: "real" | "ai") => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(type)
    } else if (e.type === "dragleave") {
      setDragActive(null)
    }
  }, [])

  // Handle file drop
  const handleDrop = useCallback(async (e: React.DragEvent, type: "real" | "ai") => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)
    setProcessing(true)

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

    const processedFiles: ImageFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const preview = URL.createObjectURL(file)

      processedFiles.push({
        id: `${type}-${Date.now()}-${i}`,
        name: file.name,
        file,
        preview,
        type,
      })
    }

    if (type === "real") {
      setRealImages((prev) => [...prev, ...processedFiles])
    } else {
      setAiImages((prev) => [...prev, ...processedFiles])
    }

    setProcessing(false)
  }, [])

  // Auto-create pairs based on filename similarity
  const createPairs = () => {
    const pairs: PaintingPair[] = []

    realImages.forEach((realImg) => {
      // Find matching AI image
      const matchingAI = aiImages.find((aiImg) => {
        const realName = realImg.name.toLowerCase().replace(/[^a-z0-9]/g, "")
        const aiName = aiImg.name.toLowerCase().replace(/[^a-z0-9]/g, "")

        // Simple matching logic - you can make this more sophisticated
        return (
          realName.includes(aiName.substring(0, 5)) ||
          aiName.includes(realName.substring(0, 5)) ||
          realName.substring(0, 10) === aiName.substring(0, 10)
        )
      })

      if (matchingAI) {
        const title = extractTitle(realImg.name)
        pairs.push({
          id: `pair-${Date.now()}-${pairs.length}`,
          title,
          year: "",
          realImage: realImg,
          aiImage: matchingAI,
          difficulty: "Medium",
          description: `Compare the real Van Gogh "${title}" with its AI-generated version.`,
        })
      }
    })

    setPaintingPairs(pairs)
  }

  // Extract title from filename
  const extractTitle = (filename: string): string => {
    return filename
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[-_]/g, " ") // Replace dashes/underscores with spaces
      .replace(/\b(ai|generated|fake|real|original)\b/gi, "") // Remove category words
      .replace(/\s+/g, " ") // Normalize spaces
      .trim()
      .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize
  }

  // Generate the data files
  const generateDataFiles = () => {
    // Generate paintings data
    const paintingsData = paintingPairs.map((pair) => ({
      id: pair.id,
      title: pair.title,
      year: pair.year,
      realImagePath: `/paintings/real/${pair.realImage.name}`,
      fakeImagePath: `/paintings/ai/${pair.aiImage.name}`,
      difficulty: pair.difficulty,
      points:
        pair.difficulty === "Easy" ? 10 : pair.difficulty === "Medium" ? 20 : pair.difficulty === "Hard" ? 30 : 50,
      description: pair.description,
      techniques: ["Post-Impressionism", "Impasto", "Brushwork analysis"],
      isActive: true,
    }))

    // Generate file structure instructions
    const fileStructure = {
      "public/paintings/real/": realImages.map((img) => img.name),
      "public/paintings/ai/": aiImages.map((img) => img.name),
      "data/paintings.json": paintingsData,
    }

    // Download paintings data
    const dataStr = JSON.stringify(paintingsData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const dataLink = document.createElement("a")
    dataLink.setAttribute("href", dataUri)
    dataLink.setAttribute("download", "paintings.json")
    dataLink.click()

    // Download file structure guide
    const structureStr = JSON.stringify(fileStructure, null, 2)
    const structureUri = "data:application/json;charset=utf-8," + encodeURIComponent(structureStr)
    const structureLink = document.createElement("a")
    structureLink.setAttribute("href", structureUri)
    structureLink.setAttribute("download", "file-structure.json")
    structureLink.click()

    // Generate copy commands for terminal
    const copyCommands = [
      "# Create the directory structure",
      "mkdir -p public/paintings/real",
      "mkdir -p public/paintings/ai",
      "mkdir -p data",
      "",
      "# Copy your images to these folders:",
      ...realImages.map((img) => `# Copy ${img.name} to public/paintings/real/`),
      ...aiImages.map((img) => `# Copy ${img.name} to public/paintings/ai/`),
      "",
      "# The paintings.json file goes in the data/ folder",
    ].join("\n")

    const commandsUri = "data:text/plain;charset=utf-8," + encodeURIComponent(copyCommands)
    const commandsLink = document.createElement("a")
    commandsLink.setAttribute("href", commandsUri)
    commandsLink.setAttribute("download", "setup-commands.txt")
    commandsLink.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Simple Data Manager</h1>
          <p className="text-blue-200">Drag and drop your images, then generate the data files</p>
        </div>

        {/* Drag and Drop Areas */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Real Van Gogh Drop Zone */}
          <Card className="bg-black/40 backdrop-blur-sm border-green-400/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-green-400" />
                Real Van Gogh Paintings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={realDropRef}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive === "real"
                    ? "border-green-400 bg-green-400/10 scale-105"
                    : "border-green-400/50 hover:border-green-400/80"
                }`}
                onDragEnter={(e) => handleDrag(e, "real")}
                onDragLeave={(e) => handleDrag(e, "real")}
                onDragOver={(e) => handleDrag(e, "real")}
                onDrop={(e) => handleDrop(e, "real")}
              >
                <Upload className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Drop Real Van Gogh Images Here</h3>
                <p className="text-green-200 mb-4">Drag your authentic Van Gogh paintings from your computer</p>
                <Badge className="bg-green-600">{realImages.length} images loaded</Badge>
              </div>

              {/* Real Images Preview */}
              {realImages.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                  {realImages.slice(0, 8).map((img) => (
                    <div key={img.id} className="relative">
                      <Image
                        src={img.preview || "/placeholder.svg"}
                        alt={img.name}
                        width={80}
                        height={60}
                        className="w-full h-12 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-1 -right-1 w-4 h-4 p-0"
                        onClick={() => setRealImages((prev) => prev.filter((i) => i.id !== img.id))}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {realImages.length > 8 && (
                    <div className="flex items-center justify-center bg-black/20 rounded text-white text-xs">
                      +{realImages.length - 8}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Generated Drop Zone */}
          <Card className="bg-black/40 backdrop-blur-sm border-red-400/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-red-400" />
                AI Generated Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={aiDropRef}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive === "ai"
                    ? "border-red-400 bg-red-400/10 scale-105"
                    : "border-red-400/50 hover:border-red-400/80"
                }`}
                onDragEnter={(e) => handleDrag(e, "ai")}
                onDragLeave={(e) => handleDrag(e, "ai")}
                onDragOver={(e) => handleDrag(e, "ai")}
                onDrop={(e) => handleDrop(e, "ai")}
              >
                <Upload className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Drop AI Generated Images Here</h3>
                <p className="text-red-200 mb-4">Drag your AI-generated Van Gogh style images</p>
                <Badge className="bg-red-600">{aiImages.length} images loaded</Badge>
              </div>

              {/* AI Images Preview */}
              {aiImages.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                  {aiImages.slice(0, 8).map((img) => (
                    <div key={img.id} className="relative">
                      <Image
                        src={img.preview || "/placeholder.svg"}
                        alt={img.name}
                        width={80}
                        height={60}
                        className="w-full h-12 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-1 -right-1 w-4 h-4 p-0"
                        onClick={() => setAiImages((prev) => prev.filter((i) => i.id !== img.id))}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {aiImages.length > 8 && (
                    <div className="flex items-center justify-center bg-black/20 rounded text-white text-xs">
                      +{aiImages.length - 8}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        {realImages.length > 0 && aiImages.length > 0 && (
          <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">Ready to Process</h3>
                  <p className="text-blue-200">
                    {realImages.length} real images • {aiImages.length} AI images
                  </p>
                </div>
                <Button onClick={createPairs} className="bg-yellow-600 hover:bg-yellow-700" size="lg">
                  <Eye className="w-4 h-4 mr-2" />
                  Create Pairs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Pairs */}
        {paintingPairs.length > 0 && (
          <>
            <Card className="bg-black/40 backdrop-blur-sm border-purple-400/30 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Generated Pairs ({paintingPairs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {paintingPairs.map((pair) => (
                    <div key={pair.id} className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{pair.title}</h4>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setPaintingPairs((prev) => prev.filter((p) => p.id !== pair.id))}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Image
                          src={pair.realImage.preview || "/placeholder.svg"}
                          alt="Real"
                          width={100}
                          height={60}
                          className="w-full h-12 object-cover rounded"
                        />
                        <Image
                          src={pair.aiImage.preview || "/placeholder.svg"}
                          alt="AI"
                          width={100}
                          height={60}
                          className="w-full h-12 object-cover rounded"
                        />
                      </div>

                      <Select
                        value={pair.difficulty}
                        onValueChange={(value: any) => {
                          setPaintingPairs((prev) =>
                            prev.map((p) => (p.id === pair.id ? { ...p, difficulty: value } : p)),
                          )
                        }}
                      >
                        <SelectTrigger className="bg-black/20 border-white/30 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Files */}
            <Card className="bg-black/40 backdrop-blur-sm border-green-400/30">
              <CardHeader>
                <CardTitle className="text-white">Generate Data Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-600/20 border-blue-400">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-blue-200">
                    This will download 3 files:
                    <br />• <strong>paintings.json</strong> - Your game data
                    <br />• <strong>file-structure.json</strong> - Where to put your images
                    <br />• <strong>setup-commands.txt</strong> - Terminal commands to organize files
                  </AlertDescription>
                </Alert>

                <Button onClick={generateDataFiles} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Generate & Download Data Files
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {processing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-black/80 backdrop-blur-sm border-yellow-400/30">
              <CardContent className="p-6 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white">Processing images...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
