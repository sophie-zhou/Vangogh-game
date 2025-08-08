import { NextResponse } from "next/server"
import { supabase } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { 
      gameSessionId, 
      finalScore, 
      totalQuestions, 
      correctAnswers,
      totalTime,
      difficulty
    } = await request.json()

    // Validate input
    if (!gameSessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing game session ID' },
        { status: 400 }
      )
    }

    // Get all answers for this session
    const { data: answers, error: answersError } = await supabase
      .from('game_answers')
      .select('*')
      .eq('game_session_id', gameSessionId)

    if (answersError) {
      console.error('Error fetching answers:', answersError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch game data' },
        { status: 500 }
      )
    }

    // Calculate final stats
    const totalPoints = answers?.reduce((sum, answer) => sum + (answer.points_earned || 0), 0) || 0
    const correctCount = answers?.filter(answer => answer.is_correct).length || 0
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0
    const averageTime = answers?.length > 0 
      ? answers.reduce((sum, answer) => sum + (answer.time_spent || 0), 0) / answers.length 
      : 0

    // Update game session with final stats
    const { data: sessionData, error: sessionError } = await supabase
      .from('game_sessions')
      .update({
        final_score: finalScore,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        total_points: totalPoints,
        accuracy: accuracy,
        average_time: averageTime,
        total_time: totalTime,
        difficulty,
        completed_at: new Date().toISOString(),
        status: 'completed'
      })
      .eq('id', gameSessionId)
      .select()

    if (sessionError) {
      console.error('Error updating session:', sessionError)
      return NextResponse.json(
        { success: false, error: 'Failed to update game session' },
        { status: 500 }
      )
    }

    // Create game result summary
    const gameResult = {
      sessionId: gameSessionId,
      finalScore,
      totalQuestions,
      correctAnswers,
      accuracy: Math.round(accuracy * 100) / 100,
      totalPoints,
      averageTime: Math.round(averageTime * 100) / 100,
      totalTime,
      difficulty,
      completedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      gameResult,
      session: sessionData?.[0]
    })

  } catch (error) {
    console.error('Error ending game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to end game' },
      { status: 500 }
    )
  }
} 