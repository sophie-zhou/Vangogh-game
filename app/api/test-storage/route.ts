import { NextResponse } from "next/server"
import { supabase } from "@/lib/utils"

export async function GET() {
  try {
    const buckets = ['real', 'plagiarized', 'supereasy', 'easy', 'difficult']
    const results: Record<string, any> = {}

    for (const bucket of buckets) {
      try {
        const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1 })
        
        if (error) {
          results[bucket] = { exists: false, error: error.message }
        } else {
          results[bucket] = { exists: true, files: data?.length || 0 }
        }
      } catch (err) {
        results[bucket] = { exists: false, error: err instanceof Error ? err.message : 'Unknown error' }
      }
    }

    return NextResponse.json({
      success: true,
      buckets: results
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 