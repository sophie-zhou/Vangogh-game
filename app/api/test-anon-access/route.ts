import { NextResponse } from "next/server"
import { supabase } from "@/lib/utils"

export async function GET() {
  try {
    const buckets = ['real', 'plagiarized', 'supereasy', 'easy', 'difficult']
    const results: Record<string, any> = {}

    for (const bucket of buckets) {
      try {
        console.log(`Testing bucket: ${bucket}`)
        
        // Test 1: List files in bucket
        const { data: listData, error: listError } = await supabase.storage
          .from(bucket)
          .list('', { limit: 10 })
        
        if (listError) {
          results[bucket] = { 
            exists: false, 
            error: `List error: ${listError.message}`,
            test: 'list'
          }
          continue
        }

        // Test 2: Try to get a public URL for a JPG file
        let jpgFile = null
        let folderPath = ''
        
        if (listData && listData.length > 0) {
          // Check if we have folders or files
          const folders = listData.filter(item => !item.name.includes('.'))
          const files = listData.filter(item => item.name.includes('.'))
          
          if (folders.length > 0) {
            // We have folders, let's check inside the first folder
            const folderName = folders[0].name
            folderPath = folderName
            
            // List files in the folder
            const { data: folderData, error: folderError } = await supabase.storage
              .from(bucket)
              .list(folderName, { limit: 10 })
            
            if (!folderError && folderData && folderData.length > 0) {
              // Find first JPG file in the folder
              jpgFile = folderData.find(file => 
                file.name.toLowerCase().endsWith('.jpg') || 
                file.name.toLowerCase().endsWith('.jpeg')
              )
              
              if (!jpgFile) {
                // If no JPG found, try any file
                jpgFile = folderData[0]
              }
            }
          } else if (files.length > 0) {
            // We have files directly in the bucket
            jpgFile = files.find(file => 
              file.name.toLowerCase().endsWith('.jpg') || 
              file.name.toLowerCase().endsWith('.jpeg')
            )
            
            if (!jpgFile) {
              jpgFile = files[0]
            }
          }
        }

        if (jpgFile) {
          // Test 3: Get public URL
          const filePath = folderPath ? `${folderPath}/${jpgFile.name}` : jpgFile.name
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

          // Test 4: Try to fetch the image (this tests actual anon access)
          let fetchSuccess = false
          let fetchError = null
          
          if (urlData?.publicUrl) {
            try {
              const response = await fetch(urlData.publicUrl, { 
                method: 'HEAD',
                headers: {
                  'Cache-Control': 'no-cache'
                }
              })
              fetchSuccess = response.ok
              if (!response.ok) {
                fetchError = `HTTP ${response.status}: ${response.statusText}`
              }
            } catch (fetchErr) {
              fetchError = fetchErr instanceof Error ? fetchErr.message : 'Unknown fetch error'
            }
          }

          results[bucket] = {
            exists: true,
            files: listData?.length || 0,
            jpgFile: jpgFile.name,
            filePath: folderPath ? `${folderPath}/${jpgFile.name}` : jpgFile.name,
            publicUrl: urlData?.publicUrl || null,
            fetchSuccess,
            fetchError,
            test: 'full'
          }
        } else {
          results[bucket] = {
            exists: true,
            files: listData?.length || 0,
            error: 'No files found to test',
            test: 'list_only'
          }
        }

      } catch (err) {
        results[bucket] = { 
          exists: false, 
          error: err instanceof Error ? err.message : 'Unknown error',
          test: 'exception'
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      buckets: results,
      summary: {
        totalBuckets: buckets.length,
        accessibleBuckets: Object.values(results).filter(r => r.exists).length,
        fetchableBuckets: Object.values(results).filter(r => r.fetchSuccess).length
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 