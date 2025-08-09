"use client"

import { createContext, useContext, useState, useEffect } from 'react'

interface GameStats {
  level: number
  points: number
  streak: number
  accuracy: number
  gamesPlayed: number
  totalCorrect: number
  totalAnswered: number
}

interface StatsContextType {
  stats: GameStats
  updateStats: (newStats: Partial<GameStats>) => void
  addGameResult: (correct: number, total: number, points: number, streak: number) => void
  resetStats: () => void
}

const StatsContext = createContext<StatsContextType | undefined>(undefined)

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<GameStats>(() => {
    // Always start with default stats to avoid hydration mismatch
    const defaultStats = {
      level: 1,
      points: 0,
      streak: 0,
      accuracy: 0,
      gamesPlayed: 0,
      totalCorrect: 0,
      totalAnswered: 0
    }
    return defaultStats
  })

  // Load saved stats from localStorage after initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vangogh-game-stats')
      if (saved) {
        try {
          const savedStats = JSON.parse(saved)
          setStats(savedStats)
        } catch (error) {
          console.error('Error parsing stats from localStorage:', error)
        }
      }
    }
  }, []) // Empty dependency array ensures this runs once after initial render

  // Save to localStorage whenever stats change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vangogh-game-stats', JSON.stringify(stats))
    }
  }, [stats])

  const updateStats = (newStats: Partial<GameStats>) => {
    setStats(prev => ({ ...prev, ...newStats }))
  }

  const addGameResult = (correct: number, total: number, points: number, streak: number) => {
    setStats(prev => {
      const newTotalCorrect = prev.totalCorrect + correct
      const newTotalAnswered = prev.totalAnswered + total
      const newPoints = prev.points + points
      const newGamesPlayed = prev.gamesPlayed + 1
      
      // Calculate new accuracy
      const newAccuracy = newTotalAnswered > 0 ? Math.round((newTotalCorrect / newTotalAnswered) * 100) : 0
      
      // Calculate new level (every 100 points = 1 level)
      const newLevel = Math.floor(newPoints / 100) + 1
      
      return {
        ...prev,
        level: newLevel,
        points: newPoints,
        accuracy: newAccuracy,
        gamesPlayed: newGamesPlayed,
        totalCorrect: newTotalCorrect,
        totalAnswered: newTotalAnswered,
        streak: streak // Update streak in global stats
      }
    })
  }

  const resetStats = () => {
    const defaultStats: GameStats = {
      level: 1,
      points: 0,
      streak: 0,
      accuracy: 0,
      gamesPlayed: 0,
      totalCorrect: 0,
      totalAnswered: 0
    }
    setStats(defaultStats)
  }

  return (
    <StatsContext.Provider value={{ stats, updateStats, addGameResult, resetStats }}>
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  const context = useContext(StatsContext)
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider')
  }
  return context
} 