"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Timer, Star, Zap, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface GameQuestion {
  id: number
  realImage: string
  fakeImage: string
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  points: number
  title: string
  year: string
}

export default function GamePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<"real" | "fake" | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Sample questions - replace with your actual Van Gogh dataset
  const questions: GameQuestion[] = [
    {
      id: 1,
      realImage: "/placeholder.svg?height=300&width=300",
      fakeImage: "/placeholder.svg?height=300&width=300",
      difficulty: "Easy",
      points: 10,
      title: "The Starry Night",
      year: "1889",
    },
    {
      id: 2,
      realImage: "/placeholder.svg?height=300&width=300",
      fakeImage: "/placeholder.svg?height=300&width=300",
      difficulty: "Medium",
      points: 20,
      title: "Sunflowers",
      year: "1888",
    },
    {
      id: 3,
      realImage: "/placeholder.svg?height=300&width=300",
      fakeImage: "/placeholder.svg?height=300&width=300",
      difficulty: "Hard",
      points: 30,
      title: "The Potato Eaters",
      year: "1885",
    },
  ]

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
      setGameOver(true)
    } else {
      nextQuestion()
    }
  }

  const handleAnswer = (choice: "left" | "right") => {
    setSelectedAnswer(choice === "left" ? "real" : "fake")
    setShowResult(true)

    // Simulate correct answer logic (you'll implement actual logic)
    const isCorrect = Math.random() > 0.5

    setTimeout(() => {
      if (isCorrect) {
        setScore(score + currentQ.points + streak * 5)
        setStreak(streak + 1)
      } else {
        setLives(lives - 1)
        setStreak(0)
        if (lives <= 1) {
          setGameOver(true)
          return
        }
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
    } else {
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
              <p className="text-lg text-blue-200">Best Streak: {streak}</p>
              <p className="text-lg text-green-400">Questions Answered: {currentQuestion + 1}</p>
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
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-red-500/20 text-red-400">
              <Heart className="w-4 h-4 mr-1" />
              {lives}
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
              <Star className="w-4 h-4 mr-1" />
              {score}
            </Badge>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
              <Zap className="w-4 h-4 mr-1" />
              {streak}
            </Badge>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-yellow-400/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{currentQ.title}</h2>
              <p className="text-blue-200">Painted in {currentQ.year}</p>
            </div>
            <div className="text-right">
              <Badge
                className={`mb-2 ${
                  currentQ.difficulty === "Easy"
                    ? "bg-green-600"
                    : currentQ.difficulty === "Medium"
                      ? "bg-yellow-600"
                      : currentQ.difficulty === "Hard"
                        ? "bg-orange-600"
                        : "bg-red-600"
                }`}
              >
                {currentQ.difficulty} - {currentQ.points} pts
              </Badge>
              <div className="flex items-center gap-2 text-white">
                <Timer className="w-4 h-4" />
                <span className="text-xl font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>
          <Progress value={(timeLeft / 30) * 100} className="h-2" />
        </div>

        {/* Game Question */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">Which painting is the REAL Van Gogh?</h3>
          <p className="text-blue-200 text-lg">Look carefully at the brushstrokes, color palette, and artistic style</p>
        </div>

        {/* Image Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedAnswer === "real" ? "ring-4 ring-green-400" : "hover:ring-2 hover:ring-yellow-400"
            } ${showResult ? "pointer-events-none" : ""}`}
            onClick={() => !showResult && handleAnswer("left")}
          >
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Image
                  src={currentQ.realImage || "/placeholder.svg"}
                  alt="Option A"
                  width={400}
                  height={400}
                  className="w-full h-80 object-cover rounded-lg"
                />
                {showResult && selectedAnswer === "real" && (
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Badge className="bg-green-600 text-white text-lg px-4 py-2">Your Choice</Badge>
                  </div>
                )}
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={showResult}>
                Choose Left Image
              </Button>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedAnswer === "fake" ? "ring-4 ring-green-400" : "hover:ring-2 hover:ring-yellow-400"
            } ${showResult ? "pointer-events-none" : ""}`}
            onClick={() => !showResult && handleAnswer("right")}
          >
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Image
                  src={currentQ.fakeImage || "/placeholder.svg"}
                  alt="Option B"
                  width={400}
                  height={400}
                  className="w-full h-80 object-cover rounded-lg"
                />
                {showResult && selectedAnswer === "fake" && (
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Badge className="bg-green-600 text-white text-lg px-4 py-2">Your Choice</Badge>
                  </div>
                )}
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={showResult}>
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
