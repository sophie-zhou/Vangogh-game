import { supabase } from './utils'

export interface GameQuestion {
  id: string
  realImage: string
  fakeImage: string
  difficulty: string
  points: number
  realTitle: string
  fakeTitle: string
  category: string
}

export interface GameSession {
  id: string
  startTime: string
  difficulty: string
  totalQuestions: number
  questions: GameQuestion[]
}

export interface GameAnswer {
  gameSessionId: string
  questionId: string
  selectedAnswer: 'real' | 'fake'
  timeSpent: number
  isCorrect: boolean
  difficulty: string
  points: number
}

export interface GameResult {
  sessionId: string
  finalScore: number
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  totalPoints: number
  averageTime: number
  totalTime: number
  difficulty: string
  completedAt: string
}

// Game API functions
export const gameAPI = {
  // Start a new game
  async startGame(difficulty: string = 'all', count: number = 10): Promise<{ gameSession: GameSession; questions: GameQuestion[] }> {
    const response = await fetch('/api/game/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty, count })
    })

    if (!response.ok) {
      throw new Error('Failed to start game')
    }

    const data = await response.json()
    return data
  },

  // Submit an answer
  async submitAnswer(answer: GameAnswer): Promise<{ pointsEarned: number; isCorrect: boolean }> {
    const response = await fetch('/api/game/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answer)
    })

    if (!response.ok) {
      throw new Error('Failed to submit answer')
    }

    const data = await response.json()
    return data
  },

  // End the game
  async endGame(gameSessionId: string, finalScore: number, totalQuestions: number, correctAnswers: number, totalTime: number, difficulty: string): Promise<GameResult> {
    const response = await fetch('/api/game/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameSessionId,
        finalScore,
        totalQuestions,
        correctAnswers,
        totalTime,
        difficulty
      })
    })

    if (!response.ok) {
      throw new Error('Failed to end game')
    }

    const data = await response.json()
    return data.gameResult
  }
}

// Auth API functions
export const authAPI = {
  // Register a new user
  async register(email: string, password: string, username: string) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Registration failed')
    }

    return response.json()
  },

  // Login user
  async login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    return response.json()
  },

  // Logout user
  async logout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }

    return response.json()
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return user
  }
}

// Profile API functions
export const profileAPI = {
  // Get user profile
  async getProfile() {
    const response = await fetch('/api/user/profile')
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    return response.json()
  },

  // Update user profile
  async updateProfile(username: string, avatarUrl?: string) {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, avatar_url: avatarUrl })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update profile')
    }

    return response.json()
  }
}

// Leaderboard API functions
export const leaderboardAPI = {
  // Get leaderboard
  async getLeaderboard(timeFrame: string = 'all', difficulty: string = 'all', limit: number = 10) {
    const params = new URLSearchParams({
      timeFrame,
      difficulty,
      limit: limit.toString()
    })

    const response = await fetch(`/api/leaderboard?${params}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard')
    }

    return response.json()
  }
}

// Game utility functions
export const gameUtils = {
  // Calculate points based on difficulty and time
  calculatePoints(difficulty: string, timeSpent: number, isCorrect: boolean): number {
    if (!isCorrect) return 0

    const basePoints = {
      'Super Easy': 5,
      'Easy': 10,
      'Medium': 15,
      'Hard': 20
    }

    const base = basePoints[difficulty as keyof typeof basePoints] || 10
    
    // Bonus for quick answers (under 10 seconds)
    const timeBonus = timeSpent < 10 ? Math.floor((10 - timeSpent) * 0.5) : 0
    
    return base + timeBonus
  },

  // Calculate accuracy percentage
  calculateAccuracy(correct: number, total: number): number {
    return total > 0 ? Math.round((correct / total) * 100) : 0
  },

  // Format time in seconds to MM:SS
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  // Get difficulty color
  getDifficultyColor(difficulty: string): string {
    const colors = {
      'Super Easy': 'bg-green-100 text-green-800',
      'Easy': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  },

  // Shuffle array
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
} 