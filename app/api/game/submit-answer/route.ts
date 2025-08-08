import { NextResponse } from "next/server"
import { supabase } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { 
      gameSessionId, 
      questionId, 
      selectedAnswer, 
      timeSpent, 
      isCorrect,
      difficulty,
      points
    } = await request.json()

    // Validate input
    if (!gameSessionId || !questionId || !selectedAnswer) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store the answer in the database
    const { data: answerData, error: answerError } = await supabase
      .from('game_answers')
      .insert({
        game_session_id: gameSessionId,
        question_id: questionId,
        selected_answer: selectedAnswer,
        time_spent: timeSpent,
        is_correct: isCorrect,
        difficulty,
        points_earned: isCorrect ? points : 0,
        created_at: new Date().toISOString()
      })
      .select()

    if (answerError) {
      console.error('Error storing answer:', answerError)
      return NextResponse.json(
        { success: false, error: 'Failed to store answer' },
        { status: 500 }
      )
    }

    // Update game session stats
    const { data: sessionData, error: sessionError } = await supabase
      .from('game_sessions')
      .upsert({
        id: gameSessionId,
        total_answers: 1,
        correct_answers: isCorrect ? 1 : 0,
        total_points: isCorrect ? points : 0,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()

    if (sessionError) {
      console.error('Error updating session:', sessionError)
    }

    return NextResponse.json({
      success: true,
      answer: answerData?.[0],
      pointsEarned: isCorrect ? points : 0,
      isCorrect
    })

  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit answer' },
      { status: 500 }
    )
  }
} 