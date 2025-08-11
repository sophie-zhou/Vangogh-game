"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface LearningProgress {
  completedLessons: number[]
  masteredTechniques: string[]
  totalLessons: number
  totalTechniques: number
}

interface LearningContextType {
  learningProgress: LearningProgress
  completeLesson: (lessonId: number) => void
  masterTechnique: (techniqueName: string) => void
  resetProgress: () => void
}

const defaultProgress: LearningProgress = {
  completedLessons: [],
  masteredTechniques: [],
  totalLessons: 5,
  totalTechniques: 3
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [learningProgress, setLearningProgress] = useState<LearningProgress>(defaultProgress)

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('learningProgress')
      if (saved) {
        const parsed = JSON.parse(saved)
        setLearningProgress(parsed)
      }
    } catch (error) {
      console.error('Failed to load learning progress:', error)
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('learningProgress', JSON.stringify(learningProgress))
    } catch (error) {
      console.error('Failed to save learning progress:', error)
    }
  }, [learningProgress])

  const completeLesson = (lessonId: number) => {
    setLearningProgress(prev => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(lessonId) 
        ? prev.completedLessons 
        : [...prev.completedLessons, lessonId]
    }))
  }

  const masterTechnique = (techniqueName: string) => {
    setLearningProgress(prev => ({
      ...prev,
      masteredTechniques: prev.masteredTechniques.includes(techniqueName)
        ? prev.masteredTechniques
        : [...prev.masteredTechniques, techniqueName]
    }))
  }

  const resetProgress = () => {
    setLearningProgress(defaultProgress)
  }

  return (
    <LearningContext.Provider value={{
      learningProgress,
      completeLesson,
      masterTechnique,
      resetProgress
    }}>
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
} 