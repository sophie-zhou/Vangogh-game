import { NextResponse } from "next/server"
import { supabase } from "@/lib/utils"

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "NOT SET",
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT SET"
      },
      error: error?.message || null
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "NOT SET",
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT SET"
      }
    }, { status: 500 })
  }
} 