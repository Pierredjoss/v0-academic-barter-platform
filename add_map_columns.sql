-- =====================================================
-- Add latitude/longitude columns to listings table
-- =====================================================
-- Run this in Supabase SQL Editor to enable map functionality
-- =====================================================

-- Add latitude and longitude columns if they don't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create index for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Update existing listings with approximate coordinates based on city names (Bénin cities)
UPDATE listings 
SET latitude = 6.365, longitude = 2.418 
WHERE city ILIKE '%cotonou%' AND (latitude IS NULL OR longitude IS NULL);

UPDATE listings 
SET latitude = 6.497, longitude = 2.609 
WHERE city ILIKE '%abomey-calavi%' AND (latitude IS NULL OR longitude IS NULL);

UPDATE listings 
SET latitude = 6.496, longitude = 2.629 
WHERE city ILIKE '%calavi%' AND (latitude IS NULL OR longitude IS NULL);

UPDATE listings 
SET latitude = 9.339, longitude = 2.620 
WHERE city ILIKE '%parakou%' AND (latitude IS NULL OR longitude IS NULL);

UPDATE listings 
SET latitude = 6.497, longitude = 2.607 
WHERE city ILIKE '%porto-novo%' OR city ILIKE '%porto novo%' AND (latitude IS NULL OR longitude IS NULL);

UPDATE listings 
SET latitude = 6.366, longitude = 2.450 
WHERE city ILIKE '%ouidah%' AND (latitude IS NULL OR longitude IS NULL);

UPDATE listings 
SET latitude = 7.182, longitude = 1.991 
WHERE city ILIKE '%lokossa%' AND (latitude IS NULL OR longitude IS NULL);

UPDATE listings 
SET latitude = 10.291, longitude = 1.379 
WHERE city ILIKE '%natitingou%' AND (latitude IS NULL OR longitude IS NULL);

UPDATE listings 
SET latitude = 8.030, longitude = 2.490 
WHERE city ILIKE '%savalou%' AND (latitude IS NULL OR longitude IS NULL);

UPDATE listings 
SET latitude = 7.200, longitude = 2.066 
WHERE city ILIKE '%abomey%' AND (latitude IS NULL OR longitude IS NULL);

SELECT 'Map columns added and existing cities geocoded!' AS status;
