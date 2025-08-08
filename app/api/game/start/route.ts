import { NextResponse } from "next/server"
import { supabase } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { difficulty = "all", count = 10 } = await request.json()
    
    // Get paintings from different categories
    const categories = {
      real: 'real/All of VanGogh',
      plagiarized: 'plagiarized/Plagiarized',
      supereasy: 'supereasy/Supereasy',
      easy: 'easy/Easy',
      difficult: 'difficult/Difficult'
    }

    // Fetch paintings from each category
    const paintingPromises = Object.entries(categories).map(async ([category, path]) => {
      const { data, error } = await supabase.storage
        .from(category)
        .list(path, { limit: 1000 })
      
      if (error) {
        console.error(`Error fetching ${category}:`, error)
        return []
      }
      
      return data?.map(file => ({
        url: supabase.storage.from(category).getPublicUrl(`${path}/${file.name}`).data.publicUrl,
        category,
        name: file.name
      })) || []
    })

    const allPaintings = await Promise.all(paintingPromises)
    const [realPaintings, plagiarizedPaintings, supereasyPaintings, easyPaintings, difficultPaintings] = allPaintings

    // Create game questions based on difficulty
    const questions = []
    const usedReal = new Set()
    const usedFake = new Set()

    const createQuestion = (realPaintings: any[], fakePaintings: any[], difficulty: string, points: number) => {
      const availableReal = realPaintings.filter(p => !usedReal.has(p.name))
      const availableFake = fakePaintings.filter(p => !usedFake.has(p.name))
      
      if (availableReal.length === 0 || availableFake.length === 0) return null
      
      const realIndex = Math.floor(Math.random() * availableReal.length)
      const fakeIndex = Math.floor(Math.random() * availableFake.length)
      
      const real = availableReal[realIndex]
      const fake = availableFake[fakeIndex]
      
      usedReal.add(real.name)
      usedFake.add(fake.name)
      
      return {
        id: `${difficulty}-${Date.now()}-${Math.random()}`,
        realImage: real.url,
        fakeImage: fake.url,
        difficulty,
        points,
        realTitle: real.name,
        fakeTitle: fake.name,
        category: fake.category
      }
    }

    // Generate questions based on difficulty preference
    let targetQuestions = []
    
    if (difficulty === "all" || difficulty === "supereasy") {
      const supereasyQuestions = Array.from({ length: Math.floor(count * 0.2) }, () => 
        createQuestion(realPaintings, supereasyPaintings, "Super Easy", 5)
      ).filter(Boolean)
      targetQuestions.push(...supereasyQuestions)
    }
    
    if (difficulty === "all" || difficulty === "easy") {
      const easyQuestions = Array.from({ length: Math.floor(count * 0.3) }, () => 
        createQuestion(realPaintings, easyPaintings, "Easy", 10)
      ).filter(Boolean)
      targetQuestions.push(...easyQuestions)
    }
    
    if (difficulty === "all" || difficulty === "medium") {
      const mediumQuestions = Array.from({ length: Math.floor(count * 0.3) }, () => 
        createQuestion(realPaintings, plagiarizedPaintings, "Medium", 15)
      ).filter(Boolean)
      targetQuestions.push(...mediumQuestions)
    }
    
    if (difficulty === "all" || difficulty === "hard") {
      const hardQuestions = Array.from({ length: Math.floor(count * 0.2) }, () => 
        createQuestion(realPaintings, difficultPaintings, "Hard", 20)
      ).filter(Boolean)
      targetQuestions.push(...hardQuestions)
    }

    // Shuffle questions
    const shuffledQuestions = targetQuestions.sort(() => Math.random() - 0.5)
    
    // Create game session
    const gameSession = {
      id: `game-${Date.now()}`,
      startTime: new Date().toISOString(),
      difficulty,
      totalQuestions: shuffledQuestions.length,
      questions: shuffledQuestions
    }

    return NextResponse.json({
      success: true,
      gameSession,
      questions: shuffledQuestions
    })

  } catch (error) {
    console.error('Error starting game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to start game' },
      { status: 500 }
    )
  }
} 