"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle, AlertCircle, FolderOpen, FileImage, Download, Trash2, Eye, Zap } from "lucide-react"
import Image from "next/image"

interface ProcessedImage {
  id: string
  name: string
  file: File
  preview: string
  category: "real" | "ai" | "unknown"
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  matched?: boolean
}

interface PaintingPair {
  id: string
  title: string
  realImage: ProcessedImage
  aiImage: ProcessedImage
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  year?: string
}

export default function BulkImportPage() {
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [paintingPairs, setPaintingPairs] = useState<PaintingPair[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState<"idle" | "processing" | "complete" | "error">("idle")
  const [autoMatchProgress, setAutoMatchProgress] = useState(0)
  const [currentTab, setCurrentTab] = useState("upload")

  const realFolderRef = useRef<HTMLInputElement>(null)
  const aiFolderRef = useRef<HTMLInputElement>(null)

  // Process uploaded files
  const processFiles = async (files: FileList, category: "real" | "ai") => {
    setProcessingStatus("processing")
    const newImages: ProcessedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Only process image files
      if (!file.type.startsWith("image/")) continue

      const preview = URL.createObjectURL(file)
      const processedImage: ProcessedImage = {
        id: `${category}-${Date.now()}-${i}`,
        name: file.name,
        file,
        preview,
        category,
        difficulty: "Medium", // Default difficulty
        matched: false,
      }

      newImages.push(processedImage)
      setUploadProgress(((i + 1) / files.length) * 100)

      // Small delay to prevent UI freezing
      if (i % 10 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    }

    setProcessedImages((prev) => [...prev, ...newImages])
    setProcessingStatus("complete")
    setUploadProgress(0)
  }

  // Auto-match images by filename similarity
  const autoMatchImages = async () => {
    const realImages = processedImages.filter((img) => img.category === "real")
    const aiImages = processedImages.filter((img) => img.category === "ai")

    const pairs: PaintingPair[] = []
    let matchedCount = 0

    for (let i = 0; i < realImages.length; i++) {
      const realImg = realImages[i]
      setAutoMatchProgress((i / realImages.length) * 100)

      // Find matching AI image by filename similarity
      const matchingAI = aiImages.find((aiImg) => {
        const realName = realImg.name.toLowerCase().replace(/[^a-z0-9]/g, "")
        const aiName = aiImg.name.toLowerCase().replace(/[^a-z0-9]/g, "")

        // Check if names are similar (contains similar keywords)
        return (
          realName.includes(aiName.substring(0, 5)) ||
          aiName.includes(realName.substring(0, 5)) ||
          levenshteinDistance(realName, aiName) < 5
        )
      })

      if (matchingAI && !matchingAI.matched) {
        const pair: PaintingPair = {
          id: `pair-${Date.now()}-${i}`,
          title: extractTitleFromFilename(realImg.name),
          realImage: { ...realImg, matched: true },
          aiImage: { ...matchingAI, matched: true },
          difficulty: "Medium",
        }

        pairs.push(pair)
        matchedCount++
      }

      // Small delay to prevent UI freezing
      if (i % 5 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    }

    setPaintingPairs(pairs)
    setAutoMatchProgress(100)

    // Update matched status
    setProcessedImages((prev) =>
      prev.map((img) => {
        const isPaired = pairs.some((pair) => pair.realImage.id === img.id || pair.aiImage.id === img.id)
        return { ...img, matched: isPaired }
      }),
    )

    setTimeout(() => setAutoMatchProgress(0), 2000)
  }

  // Helper function to calculate string similarity
  const levenshteinDistance = (str1: string, str2: string): number => {
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

  // Extract title from filename
  const extractTitleFromFilename = (filename: string): string => {
    return filename
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[-_]/g, " ") // Replace dashes and underscores with spaces
      .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize first letter of each word
  }

  // Export final dataset
  const exportDataset = () => {
    const dataset = paintingPairs.map((pair) => ({
      id: pair.id,
      title: pair.title,
      year: pair.year || "",
      difficulty: pair.difficulty,
      points:
        pair.difficulty === "Easy" ? 10 : pair.difficulty === "Medium" ? 20 : pair.difficulty === "Hard" ? 30 : 50,
      realImageName: pair.realImage.name,
      aiImageName: pair.aiImage.name,
      description: `A ${pair.difficulty.toLowerCase()} level comparison between a real Van Gogh painting and an AI-generated version.`,
      techniques: ["Post-Impressionism", "Impasto", "Brushwork analysis"],
      isActive: true,
    }))

    const dataStr = JSON.stringify(dataset, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `vangogh-dataset-${paintingPairs.length}-pairs.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Bulk set difficulty
  const bulkSetDifficulty = (difficulty: "Easy" | "Medium" | "Hard" | "Expert") => {
    setPaintingPairs((prev) => prev.map((pair) => ({ ...pair, difficulty })))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Bulk Import System</h1>
          <p className="text-blue-200">Process 500+ Van Gogh images efficiently</p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-black/30 backdrop-blur-sm">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="process">
              <Zap className="w-4 h-4 mr-2" />
              Auto-Match
            </TabsTrigger>
            <TabsTrigger value="review">
              <Eye className="w-4 h-4 mr-2" />
              Review Pairs
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="w-4 h-4 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Real Van Gogh Images */}
              <Card className="bg-black/40 backdrop-blur-sm border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileImage className="w-5 h-5 text-green-400" />
                    Real Van Gogh Paintings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-green-400/50 rounded-lg p-8 text-center">
                    <FolderOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Select Real Paintings Folder</h3>
                    <p className="text-green-200 mb-4">Choose all authentic Van Gogh images</p>

                    <input
                      ref={realFolderRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && processFiles(e.target.files, "real")}
                    />
                    <Button onClick={() => realFolderRef.current?.click()} className="bg-green-600 hover:bg-green-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Real Images
                    </Button>

                    <div className="mt-4">
                      <Badge className="bg-green-600">
                        {processedImages.filter((img) => img.category === "real").length} real images loaded
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Generated Images */}
              <Card className="bg-black/40 backdrop-blur-sm border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileImage className="w-5 h-5 text-red-400" />
                    AI Generated Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-red-400/50 rounded-lg p-8 text-center">
                    <FolderOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Select AI Images Folder</h3>
                    <p className="text-red-200 mb-4">Choose all AI-generated versions</p>

                    <input
                      ref={aiFolderRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && processFiles(e.target.files, "ai")}
                    />
                    <Button onClick={() => aiFolderRef.current?.click()} className="bg-red-600 hover:bg-red-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose AI Images
                    </Button>

                    <div className="mt-4">
                      <Badge className="bg-red-600">
                        {processedImages.filter((img) => img.category === "ai").length} AI images loaded
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Processing Progress */}
            {processingStatus === "processing" && (
              <Card className="mt-8 bg-black/40 backdrop-blur-sm border-yellow-400/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">Processing images...</span>
                    <span className="text-yellow-400">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </CardContent>
              </Card>
            )}

            {/* Upload Summary */}
            {processedImages.length > 0 && (
              <Card className="mt-8 bg-black/40 backdrop-blur-sm border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Upload Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {processedImages.filter((img) => img.category === "real").length}
                      </div>
                      <div className="text-sm text-green-200">Real Images</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">
                        {processedImages.filter((img) => img.category === "ai").length}
                      </div>
                      <div className="text-sm text-red-200">AI Images</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{processedImages.length}</div>
                      <div className="text-sm text-blue-200">Total Images</div>
                    </div>
                  </div>

                  {processedImages.length > 0 && (
                    <div className="mt-6 text-center">
                      <Button onClick={() => setCurrentTab("process")} className="bg-yellow-600 hover:bg-yellow-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Next: Auto-Match Images
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Auto-Match Tab */}
          <TabsContent value="process">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Automatic Image Matching</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-blue-200">
                  <p>
                    This will automatically pair real Van Gogh images with their AI-generated counterparts based on
                    filename similarity.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Available for Matching</h3>
                    <div className="text-2xl font-bold text-green-400">
                      {processedImages.filter((img) => img.category === "real" && !img.matched).length}
                    </div>
                    <div className="text-sm text-green-200">Real images</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">AI Images Available</h3>
                    <div className="text-2xl font-bold text-red-400">
                      {processedImages.filter((img) => img.category === "ai" && !img.matched).length}
                    </div>
                    <div className="text-sm text-red-200">AI images</div>
                  </div>
                </div>

                <Button
                  onClick={autoMatchImages}
                  disabled={processedImages.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Auto-Matching
                </Button>

                {/* Auto-match Progress */}
                {autoMatchProgress > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">Matching images...</span>
                      <span className="text-purple-400">{Math.round(autoMatchProgress)}%</span>
                    </div>
                    <Progress value={autoMatchProgress} className="h-2" />
                  </div>
                )}

                {/* Matching Results */}
                {paintingPairs.length > 0 && (
                  <Alert className="bg-green-600/20 border-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-200">
                      Successfully matched {paintingPairs.length} painting pairs!
                      <br />
                      <Button
                        onClick={() => setCurrentTab("review")}
                        className="mt-2 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Review Pairs
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review Pairs Tab */}
          <TabsContent value="review">
            <div className="space-y-6">
              {/* Bulk Actions */}
              <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Bulk Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Label className="text-white">Set all pairs to:</Label>
                    <Select onValueChange={(value: any) => bulkSetDifficulty(value)}>
                      <SelectTrigger className="w-48 bg-black/20 border-white/30 text-white">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy (10 pts)</SelectItem>
                        <SelectItem value="Medium">Medium (20 pts)</SelectItem>
                        <SelectItem value="Hard">Hard (30 pts)</SelectItem>
                        <SelectItem value="Expert">Expert (50 pts)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className="bg-blue-600">{paintingPairs.length} pairs</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Pairs Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paintingPairs.map((pair, index) => (
                  <Card key={pair.id} className="bg-black/40 backdrop-blur-sm border-white/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-sm">{pair.title}</CardTitle>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setPaintingPairs((prev) => prev.filter((p) => p.id !== pair.id))}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Image Pair */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-green-400">Real</Label>
                          <Image
                            src={pair.realImage.preview || "/placeholder.svg"}
                            alt="Real"
                            width={150}
                            height={100}
                            className="w-full h-20 object-cover rounded"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-red-400">AI</Label>
                          <Image
                            src={pair.aiImage.preview || "/placeholder.svg"}
                            alt="AI"
                            width={150}
                            height={100}
                            className="w-full h-20 object-cover rounded"
                          />
                        </div>
                      </div>

                      {/* Difficulty Selector */}
                      <Select
                        value={pair.difficulty}
                        onValueChange={(value: any) => {
                          setPaintingPairs((prev) =>
                            prev.map((p) => (p.id === pair.id ? { ...p, difficulty: value } : p)),
                          )
                        }}
                      >
                        <SelectTrigger className="bg-black/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {paintingPairs.length === 0 && (
                <Card className="bg-black/40 backdrop-blur-sm border-gray-400/30">
                  <CardContent className="p-12 text-center">
                    <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No painting pairs created yet</p>
                    <p className="text-gray-500">Go back to the Auto-Match tab to create pairs</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <Card className="bg-black/40 backdrop-blur-sm border-green-400/30">
              <CardHeader>
                <CardTitle className="text-white">Export Dataset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{paintingPairs.length}</div>
                    <div className="text-sm text-blue-200">Total Pairs</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">
                      {paintingPairs.filter((p) => p.difficulty === "Easy").length}
                    </div>
                    <div className="text-sm text-green-200">Easy</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      {paintingPairs.filter((p) => p.difficulty === "Medium").length}
                    </div>
                    <div className="text-sm text-yellow-200">Medium</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-400">
                      {paintingPairs.filter((p) => p.difficulty === "Hard" || p.difficulty === "Expert").length}
                    </div>
                    <div className="text-sm text-red-200">Hard+</div>
                  </div>
                </div>

                <div className="text-blue-200">
                  <h3 className="text-white font-semibold mb-2">What happens when you export:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Creates a JSON file with all painting pair data</li>
                    <li>Includes difficulty levels and point values</li>
                    <li>Ready to import into your game</li>
                    <li>Preserves all metadata and settings</li>
                  </ul>
                </div>

                <Button
                  onClick={exportDataset}
                  disabled={paintingPairs.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export {paintingPairs.length} Painting Pairs
                </Button>

                {paintingPairs.length === 0 && (
                  <Alert className="bg-yellow-600/20 border-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-200">
                      No painting pairs to export. Please create some pairs first.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
