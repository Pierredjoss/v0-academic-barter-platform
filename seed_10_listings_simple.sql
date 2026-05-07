-- =====================================================
-- ɖyɔ̌ - Academic Barter Platform - Seed 10 Listings (Simple Version)
-- =====================================================
-- This script inserts 10 sample listings with images
-- Uses specific UUIDs for categories to ensure consistency
-- =====================================================

-- Step 1: Insert or update categories with fixed UUIDs
INSERT INTO categories (id, name, name_fr, icon, color) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'livres-cours', 'Matériels et Fournitures', 'book-open', '#3b82f6'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'manuels', 'Manuels Scolaires & Livres', 'graduation-cap', '#8b5cf6'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'annales', 'Annales & Sujets d''Examens', 'file-text', '#f59e0b'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'notes-fiches', 'Notes de Cours & Fiches de Révision', 'notebook-pen', '#10b981'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'romans', 'Romans & Littérature', 'book-open', '#ec4899')
ON CONFLICT (name) DO UPDATE SET
    id = EXCLUDED.id,
    name_fr = EXCLUDED.name_fr,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color;

-- Step 2: Check existing users (run this first to get user IDs)
-- SELECT id, full_name, email FROM profiles LIMIT 5;

-- Step 3: Insert 10 listings (replace USER_ID_X with actual UUIDs from step 2)
-- Example with placeholder comments - replace with actual user IDs

-- Listing 1: Manuel Math
-- INSERT INTO listings (user_id, title, description, category_id, condition, exchange_type, city, status, images, views)
-- VALUES ('REPLACE_WITH_USER_ID_1', 'Manuel de Mathématiques Terminale S', 'Manuel complet de mathématiques pour la terminale scientifique. Très bon état, quelques annotations au crayon.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'good', 'in_person', 'Cotonou', 'active', ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'], 15);

-- =====================================================
-- MANUAL INSTRUCTIONS:
-- =====================================================
-- 1. First run: SELECT id, full_name, email FROM profiles LIMIT 3;
-- 2. Copy the user IDs from the results
-- 3. Replace 'REPLACE_WITH_USER_ID_X' below with actual UUIDs
-- 4. Uncomment the INSERT statements and run again
-- =====================================================

-- EXAMPLE with actual inserts (uncomment and modify with real user IDs):
/*
INSERT INTO listings (user_id, title, description, category_id, condition, exchange_type, city, status, images, views) VALUES
    ('REPLACE_WITH_USER_ID_1', 'Manuel de Mathématiques Terminale S', 'Manuel complet de mathématiques pour la terminale scientifique. Très bon état.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'good', 'in_person', 'Cotonou', 'active', ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'], 15),
    ('REPLACE_WITH_USER_ID_1', 'Annales BAC Physique-Chimie 2020-2023', 'Collection complète des sujets de BAC avec corrigés détaillés.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'like_new', 'both', 'Cotonou', 'active', ARRAY['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800'], 23),
    ('REPLACE_WITH_USER_ID_2', 'Cours de Droit Constitutionnel L1', 'Fiches de révision complètes pour le droit constitutionnel.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'new', 'delivery', 'Parakou', 'active', ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'], 8),
    ('REPLACE_WITH_USER_ID_2', 'L''Étranger d''Albert Camus', 'Édition de poche, état correct, très lisible.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'fair', 'in_person', 'Abomey-Calavi', 'active', ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'], 42),
    ('REPLACE_WITH_USER_ID_3', 'Manuel d''Économie Générale BTS', 'Manuel complet pour les étudiants en BTS économie.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'new', 'delivery', 'Porto-Novo', 'active', ARRAY['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800'], 12),
    ('REPLACE_WITH_USER_ID_1', 'Chimie Organique Avancée', 'Ouvrage de référence pour la chimie organique.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'like_new', 'in_person', 'Cotonou', 'active', ARRAY['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800'], 31),
    ('REPLACE_WITH_USER_ID_3', 'Sujets d''Examens L2 Droit des Affaires', 'Compilation des partiels des 5 dernières années.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'good', 'both', 'Parakou', 'active', ARRAY['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'], 19),
    ('REPLACE_WITH_USER_ID_2', 'Fiches de Philosophie - La Morale', 'Fiches synthétiques sur les notions de morale.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'new', 'in_person', 'Abomey-Calavi', 'active', ARRAY['https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=800'], 27),
    ('REPLACE_WITH_USER_ID_1', 'Les Misérables - Victor Hugo', 'Édition intégrale, reliure solide.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'good', 'delivery', 'Cotonou', 'active', ARRAY['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'], 56),
    ('REPLACE_WITH_USER_ID_3', 'Cours de Programmation Python', 'Cours complet avec exemples pratiques.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'like_new', 'both', 'Porto-Novo', 'active', ARRAY['https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800'], 34);
*/

-- =====================================================
-- Quick helper to see what to replace
-- =====================================================
SELECT 'Run this first to get user IDs:' AS instruction;
SELECT 'SELECT id, full_name, university FROM profiles LIMIT 5;' AS query_to_run;
