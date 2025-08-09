"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Timer, Star, Zap, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/utils"
import { useStats } from "@/lib/stats-context"

interface GameQuestion {
  id: number
  realImage: string
  fakeImage: string
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  points: number
  title: string
  year: string
  realIsLeft: boolean
}

export default function GamePage() {
  const { updateStats, addGameResult } = useStats()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<"real" | "fake" | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)

  useEffect(() => {
    async function fetchImages() {
      setLoading(true)
      console.log('🔄 Starting to fetch images...')
      
      try {
      // Helper to get public URLs for a folder
      const getPublicUrls = (folder: string, prefix: string, difficulty: string) => {
        return window.fetch(`/paintings/${folder}/${prefix}/`).then(async () => {
          // List files in the folder
          // This is a hack: in production, you should have a manifest or use an API route
          // Here, we hardcode the file count for demo, or you can fetch from Supabase if uploaded there
          return [] // Placeholder, will fill below
        })
      }
      // For demo, we will just use the Supabase storage API to list files
      // Real
      const { data: realData } = await supabase.storage.from('real').list('All of VanGogh', { limit: 1000 })
      // Plagiarized
      const { data: plagData } = await supabase.storage.from('plagiarized').list('Plagiarized', { limit: 1000 })
      // Difficulty
      const { data: supereasyData } = await supabase.storage.from('supereasy').list('Supereasy', { limit: 1000 })
      const { data: easyData } = await supabase.storage.from('easy').list('Easy', { limit: 1000 })
      const { data: difficultData } = await supabase.storage.from('difficult').list('Difficult', { limit: 1000 })
      // Compose pairs
      const pairs: any[] = []
      
      // Filter out non-image files
      const filterImageFiles = (files: any[]) => {
        return files.filter(file => 
          file.name.toLowerCase().endsWith('.jpg') || 
          file.name.toLowerCase().endsWith('.jpeg') || 
          file.name.toLowerCase().endsWith('.png') ||
          file.name.toLowerCase().endsWith('.gif') ||
          file.name.toLowerCase().endsWith('.webp')
        )
      }
      
      const realImages = filterImageFiles(realData || [])
      const plagImages = filterImageFiles(plagData || [])
      const supereasyImages = filterImageFiles(supereasyData || [])
      const easyImages = filterImageFiles(easyData || [])
      const difficultImages = filterImageFiles(difficultData || [])
      
      console.log(`📸 Filtered images: Real=${realImages.length}, Plagiarized=${plagImages.length}, Supereasy=${supereasyImages.length}, Easy=${easyImages.length}, Difficult=${difficultImages.length}`)
      
      // Real vs Plagiarized
      if (realImages.length > 0 && plagImages.length > 0) {
        const minLen = Math.min(realImages.length, plagImages.length)
        for (let i = 0; i < minLen; i++) {
          pairs.push({
            id: `real-plagiarized-${i}`,
            realImage: supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realImages[i].name}`).data.publicUrl,
            fakeImage: supabase.storage.from('plagiarized').getPublicUrl(`Plagiarized/${plagImages[i].name}`).data.publicUrl,
            difficulty: 'Plagiarized',
            points: 10,
            title: realImages[i].name,
            year: '',
            realIsLeft: Math.random() < 0.5, // Randomly assign real to left or right
          })
        }
      }
      // Real vs Super Easy
      if (realImages.length > 0 && supereasyImages.length > 0) {
        const minLen = Math.min(realImages.length, supereasyImages.length)
        for (let i = 0; i < minLen; i++) {
          pairs.push({
            id: `real-super-easy-${i}`,
            realImage: supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realImages[i].name}`).data.publicUrl,
            fakeImage: supabase.storage.from('supereasy').getPublicUrl(`Supereasy/${supereasyImages[i].name}`).data.publicUrl,
            difficulty: 'Super Easy',
            points: 10,
            title: realImages[i].name,
            year: '',
            realIsLeft: Math.random() < 0.5, // Randomly assign real to left or right
          })
        }
      }
      // Real vs Easy
      if (realImages.length > 0 && easyImages.length > 0) {
        const minLen = Math.min(realImages.length, easyImages.length)
        for (let i = 0; i < minLen; i++) {
          pairs.push({
            id: `real-easy-${i}`,
            realImage: supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realImages[i].name}`).data.publicUrl,
            fakeImage: supabase.storage.from('easy').getPublicUrl(`Easy/${easyImages[i].name}`).data.publicUrl,
            difficulty: 'Easy',
            points: 10,
            title: realImages[i].name,
            year: '',
            realIsLeft: Math.random() < 0.5, // Randomly assign real to left or right
          })
        }
      }
      // Real vs Difficult
      if (realImages.length > 0 && difficultImages.length > 0) {
        const minLen = Math.min(realImages.length, difficultImages.length)
        for (let i = 0; i < minLen; i++) {
          pairs.push({
            id: `real-difficult-${i}`,
            realImage: supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realImages[i].name}`).data.publicUrl,
            fakeImage: supabase.storage.from('difficult').getPublicUrl(`Difficult/${difficultImages[i].name}`).data.publicUrl,
            difficulty: 'Difficult',
            points: 10,
            title: realImages[i].name,
            year: '',
            realIsLeft: Math.random() < 0.5, // Randomly assign real to left or right
          })
        }
      }
      console.log(`📊 Found ${pairs.length} image pairs`)
      
      // Shuffle pairs and take only 5 questions
      for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
      }
      
      // Take only first 5 questions
      const gameQuestions = pairs.slice(0, 5)
      setQuestions(gameQuestions)
      setLoading(false)
      console.log(`✅ Game ready with ${gameQuestions.length} questions`)
      console.log('🎲 Question details:', gameQuestions.map(q => ({ 
        id: q.id, 
        realIsLeft: q.realIsLeft,
        leftImage: q.realIsLeft ? "REAL Van Gogh" : "AI Generated",
        rightImage: q.realIsLeft ? "AI Generated" : "REAL Van Gogh",
        title: q.title
      })))
      
    } catch (error) {
      console.error('❌ Error fetching images:', error)
      setLoading(false)
    }
    }
    fetchImages()
  }, [])

  const currentQ = questions[currentQuestion]

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp()
    }
  }, [timeLeft, gameOver, showResult])

  const handleTimeUp = () => {
    setLives(lives - 1)
    setStreak(0)
    if (lives <= 1) {
      console.log('🎮 Game over due to time running out, calling addGameResult:', { correctAnswers, totalAnswered, score })
      addGameResult(correctAnswers, totalAnswered, score)
      setGameOver(true)
    } else {
      nextQuestion()
    }
  }

  const handleAnswer = (choice: "left" | "right") => {
    setSelectedAnswer(choice === "left" ? "real" : "fake")
    setShowResult(true)

    // Determine if the answer is correct based on realIsLeft property
    const correct = (choice === "left" && currentQ.realIsLeft) || (choice === "right" && !currentQ.realIsLeft)
    setIsCorrect(correct)
    setTotalAnswered(prev => prev + 1)

    // Update streak and score immediately
    if (correct) {
      const pointsEarned = currentQ.points + (streak * 5)
      setScore(prev => prev + pointsEarned)
      setStreak(prev => prev + 1)
      setCorrectAnswers(prev => prev + 1)
    } else {
      setLives(prev => prev - 1)
      setStreak(0)
    }

    // Debug logging for image assignment
    console.log('🎯 Answer Debug:', {
      choice,
      realIsLeft: currentQ.realIsLeft,
      correct,
      selectedAnswer: choice === "left" ? "real" : "fake",
      leftImage: currentQ.realIsLeft ? "REAL Van Gogh" : "AI Generated",
      rightImage: currentQ.realIsLeft ? "AI Generated" : "REAL Van Gogh",
      questionTitle: currentQ.title
    })

    setTimeout(() => {
      if (lives <= 1) {
        console.log('🎮 Game over due to lives lost, calling addGameResult:', { correctAnswers, totalAnswered, score })
        addGameResult(correctAnswers, totalAnswered, score)
        setGameOver(true)
        return
      }
      nextQuestion()
    }, 2000)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(30)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsCorrect(null)
    } else {
      // Game completed - update global stats
      console.log('🎮 Game completed, calling addGameResult:', { correctAnswers, totalAnswered, score })
      addGameResult(correctAnswers, totalAnswered, score)
      setGameOver(true)
    }
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setLives(3)
    setStreak(0)
    setTimeLeft(30)
    setGameOver(false)
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(null)
    setCorrectAnswers(0)
    setTotalAnswered(0)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading images...</div>
  }

  if (!currentQ) {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">No more questions available.</div>
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 flex items-center justify-center p-4">
        <Card className="bg-black/80 backdrop-blur-sm border-yellow-400/50 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-xl text-yellow-400">Final Score: {score}</p>
              <p className="text-lg text-blue-200">Correct Answers: {correctAnswers}/{totalAnswered}</p>
              <p className="text-lg text-green-400">Accuracy: {totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0}%</p>
            </div>
            <div className="space-y-3">
              <Button onClick={resetGame} className="w-full bg-yellow-600 hover:bg-yellow-700">
                Play Again
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full md:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
            <Badge variant="secondary" className="bg-red-500/20 text-red-400 text-sm">
              <Heart className="w-4 h-4 mr-1" />
              {lives}
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 text-sm">
              <Star className="w-4 h-4 mr-1" />
              {score}
            </Badge>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-sm">
              <Zap className="w-4 h-4 mr-1" />
              {streak}
            </Badge>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-6 border border-yellow-400/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Question {currentQuestion + 1} of {questions.length}</h2>
            </div>
            <div className="text-center md:text-right">
              <Badge
                className={`mb-2 text-sm ${
                  currentQ.difficulty === "Easy"
                    ? "bg-green-600"
                    : currentQ.difficulty === "Medium"
                      ? "bg-yellow-600"
                      : currentQ.difficulty === "Hard"
                        ? "bg-orange-600"
                        : "bg-red-600"
                }`}
              >
                {currentQ.difficulty} - {currentQ.points + (streak * 5)} pts
              </Badge>
              <div className="flex items-center justify-center md:justify-end gap-2 text-white">
                <Timer className="w-4 h-4" />
                <span className="text-lg md:text-xl font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>
          <Progress value={(timeLeft / 30) * 100} className="h-2" />
        </div>

        {/* Game Question */}
        <div className="text-center mb-6 md:mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Which painting is the REAL Van Gogh?</h3>
          <p className="text-blue-200 text-base md:text-lg">Look carefully at the brushstrokes, color palette, and artistic style</p>
        </div>

        {/* Image Comparison */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-8">
          <Card
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedAnswer === "real" ? "ring-4 ring-green-400" : "hover:ring-2 hover:ring-yellow-400"
            } ${showResult ? "pointer-events-none" : ""} min-h-[400px]`}
            onClick={() => !showResult && handleAnswer("left")}
          >
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Image
                  src={currentQ.realIsLeft ? currentQ.realImage : currentQ.fakeImage || "/placeholder.svg"}
                  alt="Option A"
                  width={400}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
                {showResult && selectedAnswer === "real" && isCorrect && (
                  <div className="absolute inset-0 bg-green-500/40 rounded-lg flex items-center justify-center">
                    <Badge className="bg-green-600 text-white text-xl md:text-lg px-6 py-3 md:px-4 md:py-2 font-bold">Correct!</Badge>
                  </div>
                )}
                {showResult && selectedAnswer === "real" && !isCorrect && (
                  <div className="absolute inset-0 bg-red-500/40 rounded-lg flex items-center justify-center">
                    <Badge className="bg-red-600 text-white text-xl md:text-lg px-6 py-3 md:px-4 md:py-2 font-bold">Wrong!</Badge>
                  </div>
                )}
                {showResult && selectedAnswer === "fake" && currentQ.realIsLeft && (
                  <div className="absolute inset-0 bg-green-500/40 rounded-lg flex items-center justify-center">
                    <Badge className="bg-green-600 text-white text-xl md:text-lg px-6 py-3 md:px-4 md:py-2 font-bold">Correct Answer</Badge>
                  </div>
                )}
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={showResult}>
                Choose Left Image
              </Button>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedAnswer === "fake" ? "ring-4 ring-green-400" : "hover:ring-2 hover:ring-yellow-400"
            } ${showResult ? "pointer-events-none" : ""} min-h-[400px]`}
            onClick={() => !showResult && handleAnswer("right")}
          >
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Image
                  src={currentQ.realIsLeft ? currentQ.fakeImage : currentQ.realImage || "/placeholder.svg"}
                  alt="Option B"
                  width={400}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
                {showResult && selectedAnswer === "fake" && isCorrect && (
                  <div className="absolute inset-0 bg-green-500/40 rounded-lg flex items-center justify-center">
                    <Badge className="bg-green-600 text-white text-xl md:text-lg px-6 py-3 md:px-4 md:py-2 font-bold">Correct!</Badge>
                  </div>
                )}
                {showResult && selectedAnswer === "fake" && !isCorrect && (
                  <div className="absolute inset-0 bg-red-500/40 rounded-lg flex items-center justify-center">
                    <Badge className="bg-red-600 text-white text-xl md:text-lg px-6 py-3 md:px-4 md:py-2 font-bold">Wrong!</Badge>
                  </div>
                )}
                {showResult && selectedAnswer === "real" && !currentQ.realIsLeft && (
                  <div className="absolute inset-0 bg-green-500/40 rounded-lg flex items-center justify-center">
                    <Badge className="bg-green-600 text-white text-xl md:text-lg px-6 py-3 md:px-4 md:py-2 font-bold">Correct Answer</Badge>
                  </div>
                )}
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg" disabled={showResult}>
                Choose Right Image
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-blue-200">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </div>
      </div>
    </div>
  )
}
