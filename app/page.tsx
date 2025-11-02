"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CustomProgress } from "@/components/ui/custom-progress"
import { Palette, Trophy, BookOpen, Upload } from "lucide-react"
import Link from "next/link"
import { useStats } from "@/lib/stats-context"
import { useLearning } from "@/lib/learning-context"

export default function HomePage() {
  const { stats } = useStats()
  const { learningProgress } = useLearning()

  // Debug logging
  console.log('🏠 Home Page Stats:', stats)
  console.log('📚 Learning Progress:', learningProgress)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 relative overflow-hidden">
      {/* Van Gogh-style swirls background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-yellow-400 rounded-full animate-spin-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-4 border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border-4 border-green-400 rounded-full animate-bounce-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white font-serif">VanGotcha!: Van Gogh Detective</h1>
          </div>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-6">
            Master the art of authentication! Distinguish real Van Gogh masterpieces from AI-generated imitations!
          </p>
          <Link href="/upload">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Upload className="w-5 h-5 mr-2" />
              Submit your Artwork!
            </Button>
          </Link>
        </header>

        {/* User Stats Bar */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-yellow-400/30">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">{stats.level}</div>
              <div className="text-sm text-blue-200">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.points}</div>
              <div className="text-sm text-blue-200">Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{stats.streak}</div>
              <div className="text-sm text-blue-200">Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.accuracy}%</div>
              <div className="text-sm text-blue-200">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{stats.gamesPlayed}</div>
              <div className="text-sm text-blue-200">Games</div>
            </div>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <Link href="/game">
            <Card className="bg-gradient-to-br from-blue-800/80 to-purple-800/80 border-yellow-400/50 hover:border-yellow-400 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Play Game</h3>
                <p className="text-blue-200 mb-4">Test your Van Gogh authentication skills by choosing the real painting</p>
                <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                  +10-50 points per game
                </Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/learn">
            <Card className="bg-gradient-to-br from-purple-800/80 to-blue-800/80 border-purple-400/50 hover:border-purple-400 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Learning Center!</h3>
                <p className="text-purple-200 mb-4">Master Van Gogh authentication techniques</p>
                <Badge variant="secondary" className="bg-purple-400/20 text-purple-400 text-base">
                  Interactive learning
                </Badge>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Learning Progress */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-400/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Your Learning Progress</h3>
            <span className="text-purple-400 font-bold">Learning Center</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200">Lessons Completed</span>
                <span className="text-purple-400 font-bold">{learningProgress.completedLessons.length}/{learningProgress.totalLessons}</span>
              </div>
              <CustomProgress variant="learning" value={(learningProgress.completedLessons.length / learningProgress.totalLessons) * 100} className="h-3 mb-4" />
              <p className="text-sm text-blue-200">
                {learningProgress.completedLessons.length === 0 ? "Start with basic techniques" : 
                 learningProgress.completedLessons.length < 3 ? "Great progress! Keep learning" : 
                 "Almost there! Complete the course"}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200">Techniques Mastered</span>
                <span className="text-purple-400 font-bold">{learningProgress.masteredTechniques.length}/{learningProgress.totalTechniques}</span>
              </div>
              <CustomProgress value={(learningProgress.masteredTechniques.length / learningProgress.totalTechniques) * 100} className="h-3 mb-4" />
              <p className="text-sm text-blue-200">
                {learningProgress.masteredTechniques.length === 0 ? "Learn brushwork, color, and composition" : 
                 learningProgress.masteredTechniques.length < 2 ? "Building your skills!" : 
                 "Expert level achieved!"}
              </p>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Level Progress</h3>
            <span className="text-yellow-400 font-bold">Level {stats.level}</span>
          </div>
          <CustomProgress variant="level" value={((stats.points % 100) / 100) * 100} className="h-3 mb-2" />
          <p className="text-sm text-blue-200">{100 - (stats.points % 100)} more points to reach Level {stats.level + 1}</p>
        </div>
      </div>
    </div>
  )
}
