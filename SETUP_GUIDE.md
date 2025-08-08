# Van Gogh Game Backend Setup Guide

This guide will help you set up the complete backend for your Van Gogh game using Supabase and Next.js API routes.

## Prerequisites

- A Supabase project (free tier works fine)
- Next.js project with the existing structure
- Your painting images uploaded to Supabase Storage

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 1.2 Update Environment Variables
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 1.3 Set Up Database Schema
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL script

### 1.4 Upload Images to Storage
1. In Supabase dashboard, go to Storage
2. Create the following buckets:
   - `real` (for real Van Gogh paintings)
   - `plagiarized` (for plagiarized/AI-generated images)
   - `supereasy` (for super easy difficulty)
   - `easy` (for easy difficulty)
   - `difficult` (for difficult images)

3. Upload your images to the appropriate buckets with the correct folder structure:
   - `real/All of VanGogh/` - Real Van Gogh paintings
   - `plagiarized/Plagiarized/` - Plagiarized images
   - `supereasy/Supereasy/` - Super easy AI images
   - `easy/Easy/` - Easy AI images
   - `difficult/Difficult/` - Difficult AI images

4. Set storage policies to allow public read access:

```sql
-- Allow public read access to all storage buckets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
```

## Step 2: Update Supabase Client Configuration

Update your `lib/utils.ts` file with your actual Supabase credentials:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Supabase client setup
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## Step 3: API Routes Structure

The backend includes the following API routes:

### Game Routes
- `POST /api/game/start` - Start a new game session
- `POST /api/game/submit-answer` - Submit an answer
- `POST /api/game/end` - End a game session

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Routes
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Leaderboard Routes
- `GET /api/leaderboard` - Get leaderboard data

## Step 4: Frontend Integration

### 4.1 Update Game Page
Update your `app/game/page.tsx` to use the new API:

```typescript
import { gameAPI, gameUtils } from '@/lib/game-utils'

// In your component:
const startNewGame = async () => {
  try {
    const { gameSession, questions } = await gameAPI.startGame('all', 10)
    setGameSession(gameSession)
    setQuestions(questions)
    setCurrentQuestion(0)
  } catch (error) {
    console.error('Failed to start game:', error)
  }
}

const submitAnswer = async (selectedAnswer: 'real' | 'fake') => {
  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === 'real' // Logic to determine correctness
  
  try {
    const result = await gameAPI.submitAnswer({
      gameSessionId: gameSession.id,
      questionId: question.id,
      selectedAnswer,
      timeSpent: 30 - timeLeft,
      isCorrect,
      difficulty: question.difficulty,
      points: gameUtils.calculatePoints(question.difficulty, 30 - timeLeft, isCorrect)
    })
    
    // Update score and continue
  } catch (error) {
    console.error('Failed to submit answer:', error)
  }
}
```

### 4.2 Add Authentication Components
Create login/register forms using the auth API:

```typescript
import { authAPI } from '@/lib/game-utils'

const handleLogin = async (email: string, password: string) => {
  try {
    const result = await authAPI.login(email, password)
    // Handle successful login
  } catch (error) {
    // Handle error
  }
}
```

## Step 5: Testing the Backend

### 5.1 Test Database Connection
```bash
npm run dev
```

Visit `http://localhost:3000/api/game/start` to test if the API routes are working.

### 5.2 Test Authentication
1. Try registering a new user
2. Try logging in
3. Check if user data is created in the database

### 5.3 Test Game Flow
1. Start a game
2. Submit some answers
3. End the game
4. Check if data is properly stored

## Step 6: Environment Configuration

### 6.1 Supabase Configuration
Make sure your Supabase project has:
- Authentication enabled
- Storage buckets created
- Database tables created
- RLS policies in place

### 6.2 Next.js Configuration
Update your `next.config.mjs` if needed:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co']
  }
}

export default nextConfig
```

## Step 7: Deployment

### 7.1 Vercel Deployment
1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### 7.2 Environment Variables for Production
Make sure to add these to your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase project allows your domain
2. **Authentication Errors**: Check if RLS policies are correctly set up
3. **Storage Access Errors**: Ensure storage buckets have proper policies
4. **Database Connection**: Verify your Supabase credentials

### Debug Tips

1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Test API routes directly with tools like Postman
4. Verify database schema is correctly applied

## API Reference

### Game API

#### Start Game
```typescript
POST /api/game/start
Body: { difficulty: string, count: number }
Response: { gameSession: GameSession, questions: GameQuestion[] }
```

#### Submit Answer
```typescript
POST /api/game/submit-answer
Body: GameAnswer
Response: { pointsEarned: number, isCorrect: boolean }
```

#### End Game
```typescript
POST /api/game/end
Body: { gameSessionId, finalScore, totalQuestions, correctAnswers, totalTime, difficulty }
Response: { gameResult: GameResult }
```

### Auth API

#### Register
```typescript
POST /api/auth/register
Body: { email: string, password: string, username: string }
Response: { user: User, session: Session }
```

#### Login
```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, session: Session }
```

### Leaderboard API

#### Get Leaderboard
```typescript
GET /api/leaderboard?timeFrame=all&difficulty=all&limit=10
Response: { leaderboard: LeaderboardEntry[], timeFrame: string, difficulty: string }
```

## Next Steps

1. Add more game features (achievements, daily challenges)
2. Implement real-time multiplayer
3. Add analytics and reporting
4. Create admin dashboard
5. Add social features (friends, sharing)

This backend provides a solid foundation for your Van Gogh game with user authentication, game state management, scoring, and leaderboards. 