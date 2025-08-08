"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Palette, Eye, Brush, Calendar, MapPin, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LearnPage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2])

  const lessons = [
    {
      id: 1,
      title: "Van Gogh's Life and Times",
      description: "Learn about the artist's journey from Netherlands to France",
      duration: "5 min read",
      points: 10,
      completed: true,
    },
    {
      id: 2,
      title: "Recognizing Brushstrokes",
      description: "Understand Van Gogh's distinctive painting technique",
      duration: "8 min read",
      points: 15,
      completed: true,
    },
    {
      id: 3,
      title: "Color Theory in Van Gogh's Work",
      description: "Explore his revolutionary use of color and contrast",
      duration: "6 min read",
      points: 12,
      completed: false,
    },
    {
      id: 4,
      title: "Famous Paintings Deep Dive",
      description: "Analyze Starry Night, Sunflowers, and other masterpieces",
      duration: "10 min read",
      points: 20,
      completed: false,
    },
  ]

  const paintings = [
    {
      title: "The Starry Night",
      year: "1889",
      location: "Saint-Rémy-de-Provence",
      description:
        "Painted during Van Gogh's stay at the asylum, this masterpiece shows his unique style of swirling, dynamic brushstrokes.",
      techniques: ["Impasto", "Post-Impressionism", "Swirling patterns"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Sunflowers",
      year: "1888",
      location: "Arles",
      description:
        "A series of still life paintings that demonstrate Van Gogh's mastery of yellow pigments and texture.",
      techniques: ["Thick paint application", "Complementary colors", "Expressive brushwork"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "The Potato Eaters",
      year: "1885",
      location: "Nuenen",
      description:
        "An early work showing Van Gogh's social consciousness and his ability to capture working-class life.",
      techniques: ["Dark palette", "Realistic portraiture", "Social realism"],
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const techniques = [
    {
      name: "Impasto",
      description: "Thick application of paint that creates texture and dimension",
      icon: Brush,
      difficulty: "Advanced",
    },
    {
      name: "Complementary Colors",
      description: "Using opposite colors on the color wheel for dramatic contrast",
      icon: Palette,
      difficulty: "Intermediate",
    },
    {
      name: "Dynamic Brushstrokes",
      description: "Energetic, visible brushwork that adds movement to paintings",
      icon: Eye,
      difficulty: "Advanced",
    },
  ]

  const completeLesson = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
    }
  }

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
          <p className="text-xl text-blue-200">Explore and learn how to recognize authentic Van Gogh paintings—no tokens or points required!</p>
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
                        onClick={() => completeLesson(lesson.id)}
                        disabled={lesson.completed}
                        className={
                          lesson.completed ? "bg-green-600 hover:bg-green-600" : "bg-purple-600 hover:bg-purple-700"
                        }
                      >
                        {lesson.completed ? "Completed" : "Start Lesson"}
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
                <Card key={index} className="bg-black/40 backdrop-blur-sm border-yellow-400/30">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Image
                          src={painting.image || "/placeholder.svg"}
                          alt={painting.title}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover rounded-lg"
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
                        <div>
                          <h4 className="text-white font-semibold mb-2">Key Techniques:</h4>
                          <div className="flex flex-wrap gap-2">
                            {painting.techniques.map((technique, techIndex) => (
                              <Badge key={techIndex} className="bg-purple-600/20 text-purple-300">
                                {technique}
                              </Badge>
                            ))}
                          </div>
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
                  className="bg-black/40 backdrop-blur-sm border-green-400/30 hover:border-green-400/60 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <technique.icon className="w-8 h-8 text-green-400" />
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
                    <CardTitle className="text-white">{technique.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200">{technique.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Progress Summary */}
        <Card className="mt-8 bg-black/30 backdrop-blur-sm border-purple-400/30">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Learning Progress</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{completedLessons.length}</div>
                <div className="text-sm text-blue-200">Lessons Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {completedLessons.reduce((total, lessonId) => {
                    const lesson = lessons.find((l) => l.id === lessonId)
                    return total + (lesson?.points || 0)
                  }, 0)}
                </div>
                <div className="text-sm text-blue-200">Learning Points Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round((completedLessons.length / lessons.length) * 100)}%
                </div>
                <div className="text-sm text-blue-200">Course Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
