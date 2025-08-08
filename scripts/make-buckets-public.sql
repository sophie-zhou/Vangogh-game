-- Make all storage buckets public for anon access
-- Run this in your Supabase SQL Editor

-- Update all buckets to be public
UPDATE storage.buckets 
SET public = true 
WHERE name IN ('real', 'plagiarized', 'supereasy', 'easy', 'difficult');

-- Verify the changes
SELECT name, public FROM storage.buckets 
WHERE name IN ('real', 'plagiarized', 'supereasy', 'easy', 'difficult');

-- Also ensure we have the correct policies for public read access
-- (These should already be in place if you added them earlier)

-- Allow public read access for all storage buckets
CREATE POLICY "Public read access for real" ON storage.objects
FOR SELECT USING (bucket_id = 'real');

CREATE POLICY "Public read access for plagiarized" ON storage.objects
FOR SELECT USING (bucket_id = 'plagiarized');

CREATE POLICY "Public read access for supereasy" ON storage.objects
FOR SELECT USING (bucket_id = 'supereasy');

CREATE POLICY "Public read access for easy" ON storage.objects
FOR SELECT USING (bucket_id = 'easy');

CREATE POLICY "Public read access for difficult" ON storage.objects
FOR SELECT USING (bucket_id = 'difficult'); 