-- =====================================================
-- Fix Storage RLS for listing-images bucket
-- =====================================================
-- Run this in Supabase SQL Editor on the CURRENT database.
-- =====================================================

-- 1) Ensure the bucket exists and is public (so getPublicUrl works)
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 2) Policies on storage.objects
-- Allow anyone to read objects from this bucket (public bucket)
DROP POLICY IF EXISTS "listing-images select public" ON storage.objects;
CREATE POLICY "listing-images select public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

-- Allow authenticated users to upload ONLY into their own top-level folder: {userId}/...
DROP POLICY IF EXISTS "listing-images insert own folder" ON storage.objects;
CREATE POLICY "listing-images insert own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update ONLY their own files
DROP POLICY IF EXISTS "listing-images update own folder" ON storage.objects;
CREATE POLICY "listing-images update own folder"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete ONLY their own files
DROP POLICY IF EXISTS "listing-images delete own folder" ON storage.objects;
CREATE POLICY "listing-images delete own folder"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

SELECT 'Storage RLS fixed for listing-images' AS status;
