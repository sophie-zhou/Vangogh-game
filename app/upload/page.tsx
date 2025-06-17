"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle, AlertCircle, FolderOpen } from "lucide-react"

export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  // Handle bulk file upload
  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadStatus("uploading")
    setUploadProgress(0)

    const fileNames: string[] = []

    // Simulate upload process
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // In a real implementation, you would:
      // 1. Upload to your server/cloud storage
      // 2. Process the image
      // 3. Store metadata in database

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 100))

      fileNames.push(file.name)
      setUploadProgress(((i + 1) / files.length) * 100)
    }

    setUploadedFiles(fileNames)
    setUploadStatus("success")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Bulk Image Upload</h1>
          <p className="text-blue-200">Upload your Van Gogh paintings from Google Drive</p>
        </div>

        {/* Upload Instructions */}
        <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white">How to Import Your Paintings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-blue-200">
              <h3 className="text-white font-semibold mb-2">Step 1: Download from Google Drive</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Go to your Google Drive folder with Van Gogh paintings</li>
                <li>Select all files (Ctrl+A or Cmd+A)</li>
                <li>Right-click and choose "Download"</li>
                <li>Extract the ZIP file to your computer</li>
              </ol>
            </div>

            <div className="text-blue-200">
              <h3 className="text-white font-semibold mb-2">Step 2: Organize Your Files</h3>
              <p className="ml-4">Create two folders:</p>
              <ul className="list-disc list-inside space-y-1 ml-8">
                <li>
                  <code className="bg-black/30 px-2 py-1 rounded">real-vangogh/</code> - Original Van Gogh paintings
                </li>
                <li>
                  <code className="bg-black/30 px-2 py-1 rounded">ai-generated/</code> - AI-generated versions
                </li>
              </ul>
            </div>

            <div className="text-blue-200">
              <h3 className="text-white font-semibold mb-2">Step 3: Upload Below</h3>
              <p className="ml-4">Use the upload area below to select all your organized images</p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Upload Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-yellow-400/50 transition-colors">
              <FolderOpen className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select Your Images</h3>
              <p className="text-blue-200 mb-4">Choose multiple images from your organized folders</p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBulkUpload}
                className="hidden"
                id="bulk-upload"
              />
              <label htmlFor="bulk-upload">
                <Button asChild className="bg-yellow-600 hover:bg-yellow-700">
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Images
                  </span>
                </Button>
              </label>
            </div>

            {/* Upload Progress */}
            {uploadStatus === "uploading" && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Uploading images...</span>
                  <span className="text-yellow-400">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Upload Success */}
            {uploadStatus === "success" && (
              <Alert className="mt-6 bg-green-600/20 border-green-400">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-200">
                  Successfully uploaded {uploadedFiles.length} images!
                  <br />
                  <span className="text-sm">Next: Go to the Admin panel to organize them into painting pairs.</span>
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Error */}
            {uploadStatus === "error" && (
              <Alert className="mt-6 bg-red-600/20 border-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  Upload failed. Please try again or check your internet connection.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white">Uploaded Files ({uploadedFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {uploadedFiles.map((fileName, index) => (
                  <div key={index} className="bg-black/20 rounded p-2">
                    <p className="text-blue-200 text-sm truncate" title={fileName}>
                      {fileName}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
