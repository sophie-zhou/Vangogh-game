"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/utils"
import Image from "next/image"

export default function TestImagesPage() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImages() {
      try {
        console.log('🔄 Fetching test images...')
        
        // Get a few images from each bucket
        const { data: realData } = await supabase.storage
          .from('real').list('All of VanGogh', { limit: 5 })
        
        const { data: plagData } = await supabase.storage
          .from('plagiarized').list('Plagiarized', { limit: 5 })
        
        const testImages = []
        
        if (realData && realData.length > 0) {
          const realImage = realData.find(f => f.name.endsWith('.jpg'))
          if (realImage) {
            const realUrl = supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realImage.name}`).data.publicUrl
            testImages.push({
              name: realImage.name,
              url: realUrl,
              type: 'Real'
            })
          }
        }
        
        if (plagData && plagData.length > 0) {
          const plagImage = plagData.find(f => f.name.endsWith('.jpg'))
          if (plagImage) {
            const plagUrl = supabase.storage.from('plagiarized').getPublicUrl(`Plagiarized/${plagImage.name}`).data.publicUrl
            testImages.push({
              name: plagImage.name,
              url: plagUrl,
              type: 'Plagiarized'
            })
          }
        }
        
        setImages(testImages)
        setLoading(false)
        console.log('✅ Test images loaded:', testImages.length)
        
      } catch (error) {
        console.error('❌ Error:', error)
        setLoading(false)
      }
    }
    
    fetchImages()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading test images...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Image Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((image, index) => (
            <div key={index} className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold text-white mb-4">{image.type}: {image.name}</h3>
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover rounded-lg"
                  onLoad={() => console.log(`✅ Image loaded: ${image.name}`)}
                  onError={(e) => console.error(`❌ Image failed to load: ${image.name}`, e)}
                />
              </div>
              <p className="text-blue-200 text-sm break-all">{image.url}</p>
            </div>
          ))}
        </div>
        
        {images.length === 0 && (
          <div className="text-center text-white text-xl">
            No images found
          </div>
        )}
      </div>
    </div>
  )
} 