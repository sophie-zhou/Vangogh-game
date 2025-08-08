import { NextResponse } from "next/server"
import { supabase } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Sign in user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      console.error('Login error:', authError)
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Failed to authenticate user' },
        { status: 500 }
      )
    }

    // Update last login time
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id)

    if (updateError) {
      console.error('Error updating last login:', updateError)
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('username, avatar_url, total_games, total_score, best_score')
      .eq('id', authData.user.id)
      .single()

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: profile?.username || 'Anonymous',
        avatar: profile?.avatar_url,
        stats: {
          totalGames: profile?.total_games || 0,
          totalScore: profile?.total_score || 0,
          bestScore: profile?.best_score || 0
        }
      },
      session: authData.session
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    )
  }
} 