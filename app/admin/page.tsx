"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, Trash2, Eye, Save, Download } from "lucide-react"
import Image from "next/image"

interface PaintingData {
  id: string
  title: string
  year: string
  realImageUrl: string
  fakeImageUrl: string
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  description: string
  techniques: string[]
  isActive: boolean
}

export default function AdminPage() {
  const [paintings, setPaintings] = useState<PaintingData[]>([])
  const [currentPainting, setCurrentPainting] = useState<Partial<PaintingData>>({
    title: "",
    year: "",
    realImageUrl: "",
    fakeImageUrl: "",
    difficulty: "Easy",
    description: "",
    techniques: [],
    isActive: true,
  })
  const [dragActive, setDragActive] = useState(false)

  // Handle file upload
  const handleFileUpload = async (files: FileList, type: "real" | "fake") => {
    const file = files[0]
    if (!file) return

    // Create a local URL for preview (in production, you'd upload to your server/cloud storage)
    const imageUrl = URL.createObjectURL(file)

    setCurrentPainting((prev) => ({
      ...prev,
      [type === "real" ? "realImageUrl" : "fakeImageUrl"]: imageUrl,
    }))
  }

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent, type: "real" | "fake") => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files, type)
    }
  }

  // Save painting
  const savePainting = () => {
    if (!currentPainting.title || !currentPainting.realImageUrl || !currentPainting.fakeImageUrl) {
      alert("Please fill in all required fields")
      return
    }

    const newPainting: PaintingData = {
      id: Date.now().toString(),
      title: currentPainting.title!,
      year: currentPainting.year!,
      realImageUrl: currentPainting.realImageUrl!,
      fakeImageUrl: currentPainting.fakeImageUrl!,
      difficulty: currentPainting.difficulty!,
      description: currentPainting.description!,
      techniques: currentPainting.techniques!,
      isActive: currentPainting.isActive!,
    }

    setPaintings([...paintings, newPainting])

    // Reset form
    setCurrentPainting({
      title: "",
      year: "",
      realImageUrl: "",
      fakeImageUrl: "",
      difficulty: "Easy",
      description: "",
      techniques: [],
      isActive: true,
    })
  }

  // Export paintings data
  const exportData = () => {
    const dataStr = JSON.stringify(paintings, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "vangogh-paintings.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Import paintings data
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        setPaintings(importedData)
        alert("Data imported successfully!")
      } catch (error) {
        alert("Error importing data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Van Gogh Admin Panel</h1>
          <p className="text-blue-200">Import and manage your painting dataset</p>
        </div>

        {/* Import/Export Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={exportData} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <div>
                <Input type="file" accept=".json" onChange={importData} className="hidden" id="import-file" />
                <Label htmlFor="import-file">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add New Painting Form */}
          <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white">Add New Painting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={currentPainting.title}
                    onChange={(e) => setCurrentPainting((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., The Starry Night"
                    className="bg-black/20 border-white/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-white">
                    Year
                  </Label>
                  <Input
                    id="year"
                    value={currentPainting.year}
                    onChange={(e) => setCurrentPainting((prev) => ({ ...prev, year: e.target.value }))}
                    placeholder="e.g., 1889"
                    className="bg-black/20 border-white/30 text-white"
                  />
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <Label className="text-white">Difficulty Level</Label>
                <Select
                  value={currentPainting.difficulty}
                  onValueChange={(value: any) => setCurrentPainting((prev) => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger className="bg-black/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy (10 pts)</SelectItem>
                    <SelectItem value="Medium">Medium (20 pts)</SelectItem>
                    <SelectItem value="Hard">Hard (30 pts)</SelectItem>
                    <SelectItem value="Expert">Expert (50 pts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={currentPainting.description}
                  onChange={(e) => setCurrentPainting((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the painting..."
                  className="bg-black/20 border-white/30 text-white"
                />
              </div>

              {/* Image Upload Areas */}
              <div className="grid grid-cols-2 gap-4">
                {/* Real Van Gogh Image */}
                <div>
                  <Label className="text-white">Real Van Gogh Image *</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      dragActive ? "border-yellow-400 bg-yellow-400/10" : "border-white/30 hover:border-yellow-400/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, "real")}
                    onClick={() => document.getElementById("real-image")?.click()}
                  >
                    {currentPainting.realImageUrl ? (
                      <Image
                        src={currentPainting.realImageUrl || "/placeholder.svg"}
                        alt="Real painting"
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="text-white/70">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p>Drop real painting here or click to upload</p>
                      </div>
                    )}
                  </div>
                  <Input
                    id="real-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files, "real")}
                  />
                </div>

                {/* AI Generated Image */}
                <div>
                  <Label className="text-white">AI Generated Image *</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      dragActive ? "border-yellow-400 bg-yellow-400/10" : "border-white/30 hover:border-yellow-400/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, "fake")}
                    onClick={() => document.getElementById("fake-image")?.click()}
                  >
                    {currentPainting.fakeImageUrl ? (
                      <Image
                        src={currentPainting.fakeImageUrl || "/placeholder.svg"}
                        alt="AI generated painting"
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="text-white/70">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p>Drop AI painting here or click to upload</p>
                      </div>
                    )}
                  </div>
                  <Input
                    id="fake-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files, "fake")}
                  />
                </div>
              </div>

              <Button onClick={savePainting} className="w-full bg-yellow-600 hover:bg-yellow-700">
                <Save className="w-4 h-4 mr-2" />
                Save Painting
              </Button>
            </CardContent>
          </Card>

          {/* Paintings List */}
          <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white">Imported Paintings ({paintings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {paintings.map((painting) => (
                  <div key={painting.id} className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{painting.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${
                            painting.difficulty === "Easy"
                              ? "bg-green-600"
                              : painting.difficulty === "Medium"
                                ? "bg-yellow-600"
                                : painting.difficulty === "Hard"
                                  ? "bg-orange-600"
                                  : "bg-red-600"
                          }`}
                        >
                          {painting.difficulty}
                        </Badge>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setPaintings(paintings.filter((p) => p.id !== painting.id))}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Image
                        src={painting.realImageUrl || "/placeholder.svg"}
                        alt="Real"
                        width={100}
                        height={75}
                        className="w-full h-16 object-cover rounded"
                      />
                      <Image
                        src={painting.fakeImageUrl || "/placeholder.svg"}
                        alt="AI"
                        width={100}
                        height={75}
                        className="w-full h-16 object-cover rounded"
                      />
                    </div>
                    <p className="text-blue-200 text-sm mt-2">{painting.year}</p>
                  </div>
                ))}

                {paintings.length === 0 && (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">No paintings imported yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
