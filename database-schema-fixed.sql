-- Database Schema for Van Gogh Game (Fixed Version)
-- Run this in your Supabase SQL editor

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    total_games INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0,
    total_time_played INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game sessions table
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    difficulty VARCHAR(50) NOT NULL,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    final_score INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0,
    average_time DECIMAL(10,2) DEFAULT 0,
    total_time INTEGER DEFAULT 0, -- in seconds
    status VARCHAR(20) DEFAULT 'active', -- active, completed, abandoned
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game answers table
CREATE TABLE IF NOT EXISTS public.game_answers (
    id SERIAL PRIMARY KEY,
    game_session_id VARCHAR(255) REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    selected_answer VARCHAR(20) NOT NULL, -- 'real' or 'fake'
    time_spent INTEGER NOT NULL, -- in seconds
    is_correct BOOLEAN NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paintings metadata table (optional, for future features)
CREATE TABLE IF NOT EXISTS public.paintings (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- real, plagiarized, supereasy, easy, difficult
    difficulty VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    year VARCHAR(10),
    artist VARCHAR(100),
    description TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table (for future gamification)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON public.game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_game_sessions_final_score ON public.game_sessions(final_score DESC);
CREATE INDEX IF NOT EXISTS idx_game_answers_session_id ON public.game_answers(game_session_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_total_score ON public.users(total_score DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paintings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Users can insert their own game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Users can update their own game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Users can view their own game answers" ON public.game_answers;
DROP POLICY IF EXISTS "Users can insert their own game answers" ON public.game_answers;
DROP POLICY IF EXISTS "Authenticated users can view paintings" ON public.paintings;
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Game sessions policies
CREATE POLICY "Users can view their own game sessions" ON public.game_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game sessions" ON public.game_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions" ON public.game_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Game answers policies
CREATE POLICY "Users can view their own game answers" ON public.game_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.game_sessions 
            WHERE game_sessions.id = game_answers.game_session_id 
            AND game_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own game answers" ON public.game_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.game_sessions 
            WHERE game_sessions.id = game_answers.game_session_id 
            AND game_sessions.user_id = auth.uid()
        )
    );

-- Paintings policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view paintings" ON public.paintings
    FOR SELECT USING (auth.role() = 'authenticated');

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updating user stats

-- Function to update user stats after game completion
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user stats when a game session is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE public.users 
        SET 
            total_games = total_games + 1,
            total_score = total_score + NEW.final_score,
            best_score = GREATEST(best_score, NEW.final_score),
            total_time_played = total_time_played + NEW.total_time,
            average_accuracy = (
                (average_accuracy * (total_games - 1) + NEW.accuracy) / total_games
            )
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_user_stats ON public.game_sessions;

-- Trigger to automatically update user stats
CREATE TRIGGER trigger_update_user_stats
    AFTER UPDATE ON public.game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();

-- Function to get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(
    p_time_frame VARCHAR DEFAULT 'all',
    p_difficulty VARCHAR DEFAULT 'all',
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    rank INTEGER,
    user_id UUID,
    username VARCHAR,
    final_score INTEGER,
    accuracy DECIMAL,
    total_time INTEGER,
    difficulty VARCHAR,
    completed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    WITH ranked_sessions AS (
        SELECT 
            gs.*,
            u.username,
            ROW_NUMBER() OVER (ORDER BY gs.final_score DESC) as rank
        FROM public.game_sessions gs
        JOIN public.users u ON gs.user_id = u.id
        WHERE gs.status = 'completed'
        AND (p_difficulty = 'all' OR gs.difficulty = p_difficulty)
        AND (
            p_time_frame = 'all' 
            OR (p_time_frame = 'daily' AND gs.completed_at >= CURRENT_DATE)
            OR (p_time_frame = 'weekly' AND gs.completed_at >= CURRENT_DATE - INTERVAL '7 days')
            OR (p_time_frame = 'monthly' AND gs.completed_at >= DATE_TRUNC('month', CURRENT_DATE))
        )
    )
    SELECT 
        rs.rank,
        rs.user_id,
        rs.username,
        rs.final_score,
        rs.accuracy,
        rs.total_time,
        rs.difficulty,
        rs.completed_at
    FROM ranked_sessions rs
    WHERE rs.rank <= p_limit
    ORDER BY rs.rank;
END;
$$ LANGUAGE plpgsql; 