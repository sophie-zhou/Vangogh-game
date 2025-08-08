-- Fix storage policies and make buckets public
-- This script handles existing policies and only creates new ones if needed

-- First, make all buckets public
UPDATE storage.buckets 
SET public = true 
WHERE name IN ('real', 'plagiarized', 'supereasy', 'easy', 'difficult');

-- Verify the bucket changes
SELECT name, public FROM storage.buckets 
WHERE name IN ('real', 'plagiarized', 'supereasy', 'easy', 'difficult');

-- Create policies only if they don't exist (using IF NOT EXISTS pattern)
-- For real bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public read access for real'
    ) THEN
        CREATE POLICY "Public read access for real" ON storage.objects
        FOR SELECT USING (bucket_id = 'real');
    END IF;
END $$;

-- For plagiarized bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public read access for plagiarized'
    ) THEN
        CREATE POLICY "Public read access for plagiarized" ON storage.objects
        FOR SELECT USING (bucket_id = 'plagiarized');
    END IF;
END $$;

-- For supereasy bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public read access for supereasy'
    ) THEN
        CREATE POLICY "Public read access for supereasy" ON storage.objects
        FOR SELECT USING (bucket_id = 'supereasy');
    END IF;
END $$;

-- For easy bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public read access for easy'
    ) THEN
        CREATE POLICY "Public read access for easy" ON storage.objects
        FOR SELECT USING (bucket_id = 'easy');
    END IF;
END $$;

-- For difficult bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public read access for difficult'
    ) THEN
        CREATE POLICY "Public read access for difficult" ON storage.objects
        FOR SELECT USING (bucket_id = 'difficult');
    END IF;
END $$;

-- Show all existing policies for storage.objects
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'; 