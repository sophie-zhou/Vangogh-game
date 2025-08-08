"use client"

import { useState, useEffect } from "react"

export default function SimpleTestPage() {
  const [status, setStatus] = useState("Loading...")
  const [error, setError] = useState("")

  useEffect(() => {
    async function test() {
      try {
        console.log("🔄 Starting simple test...")
        setStatus("Testing...")
        
        // Test basic fetch
        const response = await fetch("https://httpbin.org/json")
        const data = await response.json()
        console.log("✅ Basic fetch works:", data)
        
        // Test Supabase import
        const { createClient } = await import('@supabase/supabase-js')
        console.log("✅ Supabase import works")
        
        // Test environment variables
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        console.log("✅ Environment variables:", { url: url ? "SET" : "NOT SET", key: key ? "SET" : "NOT SET" })
        
        if (!url || !key) {
          throw new Error("Missing environment variables")
        }
        
        // Test Supabase client creation
        const supabase = createClient(url, key)
        console.log("✅ Supabase client created")
        
        // Test basic storage call
        const { data: buckets, error } = await supabase.storage.listBuckets()
        
        if (error) {
          throw new Error(`Storage error: ${error.message}`)
        }
        
        console.log("✅ Storage works:", buckets?.length || 0, "buckets")
        setStatus(`Success! Found ${buckets?.length || 0} buckets`)
        
      } catch (err) {
        console.error("❌ Error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        setStatus("Error occurred")
      }
    }
    
    test()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Simple Test Page</h1>
        
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
          <h2 className="text-2xl font-bold text-white mb-4">Status: {status}</h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-red-400 mb-2">Error:</h3>
              <p className="text-red-300">{error}</p>
            </div>
          )}
          
          <div className="text-blue-200">
            <p>Check the browser console for detailed logs.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 