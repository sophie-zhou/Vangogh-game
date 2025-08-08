import { NextResponse } from "next/server"
import { supabase } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeFrame = searchParams.get('timeFrame') || 'all' // all, daily, weekly, monthly
    const difficulty = searchParams.get('difficulty') || 'all'
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('game_sessions')
      .select(`
        id,
        final_score,
        total_questions,
        correct_answers,
        accuracy,
        total_points,
        average_time,
        total_time,
        difficulty,
        completed_at,
        user_id
      `)
      .eq('status', 'completed')
      .order('final_score', { ascending: false })
      .limit(limit)

    // Filter by difficulty
    if (difficulty !== 'all') {
      query = query.eq('difficulty', difficulty)
    }

    // Filter by time frame
    if (timeFrame !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (timeFrame) {
        case 'daily':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0)
      }

      query = query.gte('completed_at', startDate.toISOString())
    }

    const { data: leaderboard, error } = await query

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch leaderboard' },
        { status: 500 }
      )
    }

    // Get user details for the leaderboard entries
    const userIds = [...new Set(leaderboard?.map(entry => entry.user_id).filter(Boolean))]
    
    let userDetails: any[] = []
    if (userIds.length > 0) {
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, username, avatar_url')
        .in('id', userIds)

      if (!userError && users) {
        userDetails = users
      }
    }

    // Combine leaderboard data with user details
    const leaderboardWithUsers = leaderboard?.map((entry, index) => {
      const user = userDetails.find(u => u.id === entry.user_id)
      return {
        rank: index + 1,
        ...entry,
        user: user ? {
          id: user.id,
          username: user.username || 'Anonymous',
          avatar: user.avatar_url
        } : null
      }
    }) || []

    return NextResponse.json({
      success: true,
      leaderboard: leaderboardWithUsers,
      timeFrame,
      difficulty,
      total: leaderboardWithUsers.length
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
} 