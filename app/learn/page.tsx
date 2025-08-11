"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Palette, Eye, Brush, Calendar, MapPin, Award, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLearning } from "@/lib/learning-context"
import { lessonContent, techniqueContent } from "@/lib/lesson-content"
import { famousWorksWithUrls } from "@/lib/famous-works"

export default function LearnPage() {
  const { learningProgress, completeLesson, masterTechnique, resetProgress } = useLearning()
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null)
  const [selectedPainting, setSelectedPainting] = useState<string | null>(null)

  const lessons = lessonContent.map(lesson => ({
    ...lesson,
    completed: learningProgress.completedLessons.includes(lesson.id)
  }))

  const paintings = famousWorksWithUrls

  const techniques = techniqueContent.map(technique => ({
    ...technique,
    icon: technique.name === "Impasto" ? Brush : 
          technique.name === "Complementary Colors" ? Palette : Eye,
    mastered: learningProgress.masteredTechniques.includes(technique.name)
  }))



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Badge className="bg-purple-600 text-white px-4 py-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Center
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">Master Van Gogh's Art</h1>
          <p className="text-xl text-blue-200">Explore and learn how to recognize authentic Van Gogh paintings!</p>
        </div>

        {/* Learning Tabs */}
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/30 backdrop-blur-sm">
            <TabsTrigger value="lessons" className="data-[state=active]:bg-purple-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="paintings" className="data-[state=active]:bg-purple-600">
              <Palette className="w-4 h-4 mr-2" />
              Famous Works
            </TabsTrigger>
            <TabsTrigger value="techniques" className="data-[state=active]:bg-purple-600">
              <Brush className="w-4 h-4 mr-2" />
              Techniques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            <div className="grid md:grid-cols-2 gap-6">
              {lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="bg-black/40 backdrop-blur-sm border-purple-400/30 hover:border-purple-400/60 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{lesson.title}</CardTitle>
                      {lesson.completed && (
                        <Badge className="bg-green-600">
                          <Award className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200 mb-4">{lesson.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>{lesson.duration}</span>
                      </div>
                      <Button
                        onClick={() => setSelectedLesson(lesson.id)}
                        className={
                          lesson.completed ? "bg-green-600 hover:bg-green-600" : "bg-purple-600 hover:bg-purple-700"
                        }
                      >
                        {lesson.completed ? "Review Lesson" : "Start Lesson"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paintings">
            <div className="space-y-8">
              {paintings.map((painting, index) => (
                <Card 
                  key={index} 
                  className="bg-black/40 backdrop-blur-sm border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedPainting(painting.id)}
                >
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Image
                          src={painting.imageUrl || "/placeholder.svg"}
                          alt={painting.title}
                          width={500}
                          height={400}
                          className="w-full h-auto max-h-96 object-contain rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{painting.title}</h3>
                        <div className="flex items-center gap-4 mb-4">
                          <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {painting.year}
                          </Badge>
                          <Badge variant="outline" className="border-blue-400 text-blue-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            {painting.location}
                          </Badge>
                        </div>
                        <p className="text-blue-200 mb-4">{painting.description}</p>
                        <div className="mb-4">
                          <h4 className="text-white font-semibold mb-2">Key Techniques:</h4>
                          <div className="flex flex-wrap gap-2">
                            {painting.techniques.map((technique, techIndex) => (
                              <Badge key={techIndex} className="bg-purple-600/20 text-purple-300">
                                {technique}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2">Artistic Significance:</h4>
                          <p className="text-blue-200 text-sm">{painting.significance}</p>
                        </div>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPainting(painting.id)
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="techniques">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techniques.map((technique, index) => (
                <Card
                  key={index}
                  className={`bg-black/40 backdrop-blur-sm transition-all duration-300 ${
                    technique.mastered 
                      ? "border-green-400/60 bg-green-900/20" 
                      : "border-green-400/30 hover:border-green-400/60"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <technique.icon className={`w-8 h-8 ${technique.mastered ? "text-green-400" : "text-green-400"}`} />
                      <div className="flex items-center gap-2">
                        {technique.mastered && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        <Badge
                          className={`${
                            technique.difficulty === "Advanced"
                              ? "bg-red-600"
                              : technique.difficulty === "Intermediate"
                                ? "bg-yellow-600"
                                : "bg-green-600"
                          }`}
                        >
                          {technique.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-white">{technique.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200 mb-4">{technique.description}</p>
                    <Button
                      onClick={() => setSelectedTechnique(technique.name)}
                      className={
                        technique.mastered 
                          ? "bg-green-600 hover:bg-green-600 w-full" 
                          : "bg-green-600 hover:bg-green-700 w-full"
                      }
                    >
                      {technique.mastered ? "Review Technique" : "Learn Technique"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Progress Summary */}
        <Card className="mt-8 bg-black/30 backdrop-blur-sm border-purple-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Your Learning Progress</h3>
              <Button 
                onClick={resetProgress} 
                variant="outline" 
                size="sm"
                className="text-red-400 border-red-400 hover:bg-red-400/20"
              >
                Reset Progress
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{learningProgress.completedLessons.length}</div>
                <div className="text-sm text-blue-200">Lessons Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {learningProgress.completedLessons.reduce((total: number, lessonId: number) => {
                    const lesson = lessons.find((l) => l.id === lessonId)
                    return total + (lesson?.points || 0)
                  }, 0)}
                </div>
                <div className="text-sm text-blue-200">Learning Points Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round((learningProgress.completedLessons.length / lessons.length) * 100)}%
                </div>
                <div className="text-sm text-blue-200">Course Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Viewer Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 border border-purple-400/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black/90 border-b border-purple-400/50 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {lessonContent.find(l => l.id === selectedLesson)?.title}
                </h2>
                <Button
                  onClick={() => setSelectedLesson(null)}
                  variant="outline"
                  size="sm"
                  className="text-purple-400 border-purple-400"
                >
                  ✕ Close
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {(() => {
                const lesson = lessonContent.find(l => l.id === selectedLesson)
                if (!lesson) return null
                
                return (
                  <div className="space-y-6">
                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold text-purple-400 mb-3">Lesson Content</h3>
                      <div className="space-y-3">
                        {lesson.content.map((paragraph, index) => (
                          <p key={index} className="text-blue-200 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Key Takeaways */}
                    <div>
                      <h3 className="text-xl font-bold text-green-400 mb-3">Key Takeaways</h3>
                      <ul className="space-y-2">
                        {lesson.keyTakeaways.map((takeaway, index) => (
                          <li key={index} className="text-blue-200 flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Examples */}
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400 mb-3">Examples</h3>
                      <ul className="space-y-2">
                        {lesson.examples.map((example, index) => (
                          <li key={index} className="text-blue-200 flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Complete Lesson Button */}
                    <div className="pt-4 border-t border-purple-400/30">
                      <Button
                        onClick={() => {
                          completeLesson(selectedLesson)
                          setSelectedLesson(null)
                        }}
                        disabled={lessons.find(l => l.id === selectedLesson)?.completed}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
                      >
                        {lessons.find(l => l.id === selectedLesson)?.completed ? "Lesson Completed!" : "Mark as Complete"}
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Technique Viewer Modal */}
      {selectedTechnique && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 border border-green-400/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black/90 border-b border-green-400/50 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {techniqueContent.find(t => t.name === selectedTechnique)?.name}
                </h2>
                <Button
                  onClick={() => setSelectedTechnique(null)}
                  variant="outline"
                  size="sm"
                  className="text-green-400 border-green-400"
                >
                  ✕ Close
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {(() => {
                const technique = techniqueContent.find(t => t.name === selectedTechnique)
                if (!technique) return null
                
                return (
                  <div className="space-y-6">
                    {/* Detailed Explanation */}
                    <div>
                      <h3 className="text-xl font-bold text-green-400 mb-3">Technique Explanation</h3>
                      <p className="text-blue-200 leading-relaxed">{technique.detailedExplanation}</p>
                    </div>

                    {/* Visual Cues */}
                    <div>
                      <h3 className="text-xl font-bold text-blue-400 mb-3">What to Look For</h3>
                      <ul className="space-y-2">
                        {technique.visualCues.map((cue, index) => (
                          <li key={index} className="text-blue-200 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            {cue}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Mistakes */}
                    <div>
                      <h3 className="text-xl font-bold text-red-400 mb-3">Common Mistakes</h3>
                      <ul className="space-y-2">
                        {technique.commonMistakes.map((mistake, index) => (
                          <li key={index} className="text-blue-200 flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practice Tips */}
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400 mb-3">Practice Tips</h3>
                      <ul className="space-y-2">
                        {technique.practiceTips.map((tip, index) => (
                          <li key={index} className="text-blue-200 flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Examples */}
                    <div>
                      <h3 className="text-xl font-bold text-purple-400 mb-3">Examples in Van Gogh's Work</h3>
                      <ul className="space-y-2">
                        {technique.examples.map((example, index) => (
                          <li key={index} className="text-blue-200 flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Master Technique Button */}
                    <div className="pt-4 border-t border-green-400/30">
                      <Button
                        onClick={() => {
                          masterTechnique(selectedTechnique)
                          setSelectedTechnique(null)
                        }}
                        disabled={techniques.find(t => t.name === selectedTechnique)?.mastered}
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                      >
                        {techniques.find(t => t.name === selectedTechnique)?.mastered ? "Technique Mastered!" : "Master This Technique"}
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Famous Work Viewer Modal */}
      {selectedPainting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 border border-yellow-400/50 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black/90 border-b border-yellow-400/50 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {famousWorksWithUrls.find(p => p.id === selectedPainting)?.title}
                </h2>
                <Button
                  onClick={() => setSelectedPainting(null)}
                  variant="outline"
                  size="sm"
                  className="text-yellow-400 border-yellow-400"
                >
                  ✕ Close
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {(() => {
                const painting = famousWorksWithUrls.find(p => p.id === selectedPainting)
                if (!painting) return null
                
                return (
                  <div className="space-y-6">
                    {/* Large Image */}
                    <div className="text-center">
                      <Image
                        src={painting.imageUrl}
                        alt={painting.title}
                        width={700}
                        height={500}
                        className="w-full max-w-4xl h-auto max-h-[32rem] object-contain rounded-lg mx-auto"
                      />
                    </div>

                    {/* Painting Details */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">About This Painting</h3>
                        <p className="text-blue-200 leading-relaxed mb-4">{painting.description}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Year & Location</h4>
                            <div className="flex items-center gap-4">
                              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                                <Calendar className="w-3 h-3 mr-1" />
                                {painting.year}
                              </Badge>
                              <Badge variant="outline" className="border-blue-400 text-blue-400">
                                <MapPin className="w-3 h-3 mr-1" />
                                {painting.location}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Techniques */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">Key Techniques Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {painting.techniques.map((technique, index) => (
                              <Badge key={index} className="bg-purple-600/20 text-purple-300 border-purple-400/30">
                                {technique}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Significance */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">Artistic Significance</h4>
                          <p className="text-blue-200 leading-relaxed">{painting.significance}</p>
                        </div>

                        {/* Authentication Tips */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">How to Authenticate</h4>
                          <ul className="space-y-2 text-blue-200">
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              Look for the characteristic brushwork patterns
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              Check the color palette matches the period
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              Examine the composition and perspective
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              Study the emotional expression and style
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
