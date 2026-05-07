-- =====================================================
-- ɖyɔ̌ - Academic Barter Platform - Complete Data Seeding
-- =====================================================
-- This script creates:
-- 1. 3 test users in auth.users and profiles
-- 2. 5 categories with fixed UUIDs
-- 3. 10 sample listings with images
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 1: Create or ensure categories exist
-- =====================================================
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

-- =====================================================
-- STEP 2: Create test users (if they don't exist)
-- =====================================================
-- User 1: student1@test.com
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'student1@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Jean Dupont","university":"Université d''Abomey-Calavi"}'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, university, city, bio, average_rating, total_exchanges, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'student1@test.com',
    'Jean Dupont',
    'Université d''Abomey-Calavi',
    'Cotonou',
    'Étudiant en licence de mathématiques, passionné par les sciences.',
    4.5,
    12,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    university = EXCLUDED.university,
    city = EXCLUDED.city;

-- User 2: student2@test.com
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'student2@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Marie Kouassi","university":"Université de Parakou"}'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, university, city, bio, average_rating, total_exchanges, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'student2@test.com',
    'Marie Kouassi',
    'Université de Parakou',
    'Parakou',
    'Étudiante en droit, j''aime partager mes cours et annales.',
    4.8,
    8,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    university = EXCLUDED.university,
    city = EXCLUDED.city;

-- User 3: student3@test.com
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'student3@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Paul Mensah","university":"Université de Porto-Novo"}'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, university, city, bio, average_rating, total_exchanges, created_at, updated_at)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'student3@test.com',
    'Paul Mensah',
    'Université de Porto-Novo',
    'Porto-Novo',
    'Étudiant en informatique, collectionneur de livres de programmation.',
    4.2,
    15,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    university = EXCLUDED.university,
    city = EXCLUDED.city;

-- =====================================================
-- STEP 3: Insert 10 sample listings
-- =====================================================
INSERT INTO listings (id, user_id, title, description, category_id, condition, exchange_type, city, status, images, views, created_at, updated_at) VALUES
    ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 
     'Manuel de Mathématiques Terminale S', 
     'Manuel complet de mathématiques pour la terminale scientifique. Très bon état, quelques annotations au crayon. Idéal pour réviser le bac. Contient tous les chapitres du programme : analyse, géométrie, probabilités.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'good', 'in_person', 'Cotonou', 'active', 
     ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80'],
     15, NOW() - INTERVAL '2 days', NOW()),
    
    ('a1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 
     'Annales BAC 2020-2023 Physique-Chimie', 
     'Collection complète des sujets de BAC en physique-chimie avec corrigés détaillés. Indispensable pour la préparation. Plus de 50 sujets avec méthodologie expliquée.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'like_new', 'both', 'Cotonou', 'active', 
     ARRAY['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80'],
     23, NOW() - INTERVAL '5 days', NOW()),
    
    ('a2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 
     'Cours de Droit Constitutionnel L1', 
     'Fiches de révision complètes pour le droit constitutionnel. Résumés des articles et jurisprudences importantes. Parfait pour les partiels.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'new', 'delivery', 'Parakou', 'active', 
     ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80'],
     8, NOW() - INTERVAL '1 day', NOW()),
    
    ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 
     'Roman - L''Étranger d''Albert Camus', 
     'Édition de poche de L''Étranger. État correct, quelques marques d''usage mais très lisible. Classique de la littérature française.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'fair', 'in_person', 'Abomey-Calavi', 'active', 
     ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80'],
     42, NOW() - INTERVAL '3 days', NOW()),
    
    ('a3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 
     'Manuel d''Économie Générale BTS', 
     'Manuel complet pour les étudiants en BTS économie. Tous les chapitres du programme avec exercices corrigés. Édition 2023.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'new', 'delivery', 'Porto-Novo', 'active', 
     ARRAY['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80'],
     12, NOW() - INTERVAL '4 days', NOW()),
    
    ('a1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 
     'Livre - Chimie Organique Avancée', 
     'Ouvrage de référence pour la chimie organique. Parfait pour les études de médecine et pharmacie. Très bon état.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'like_new', 'in_person', 'Cotonou', 'active', 
     ARRAY['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80', 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&q=80'],
     31, NOW() - INTERVAL '6 days', NOW()),
    
    ('a3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 
     'Sujets d''Examens L2 Droit des Affaires', 
     'Compilation des partiels des 5 dernières années. Avec corrigés et conseils de méthodologie. Format PDF disponible aussi.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'good', 'both', 'Parakou', 'active', 
     ARRAY['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'],
     19, NOW() - INTERVAL '2 days', NOW()),
    
    ('a2222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 
     'Fiches de Philosophie - La Morale', 
     'Fiches synthétiques sur les notions de morale. Citations, auteurs et arguments clés. Format A4 imprimé.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'new', 'in_person', 'Abomey-Calavi', 'active', 
     ARRAY['https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=800&q=80', 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80'],
     27, NOW() - INTERVAL '1 day', NOW()),
    
    ('a1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 
     'Les Misérables - Victor Hugo (édition complète)', 
     'Édition intégrale des Misérables. Reliure solide, pages en bon état. Classique de la littérature française à ne pas manquer.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'good', 'delivery', 'Cotonou', 'active', 
     ARRAY['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'],
     56, NOW() - INTERVAL '7 days', NOW()),
    
    ('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 
     'Support de Cours - Programmation Python', 
     'Cours complet de programmation Python pour débutants et intermédiaires. Exemples pratiques inclus. Idéal pour les projets data science.', 
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'like_new', 'both', 'Porto-Novo', 'active', 
     ARRAY['https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80'],
     34, NOW() - INTERVAL '3 days', NOW())
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    views = EXCLUDED.views,
    updated_at = NOW();

-- =====================================================
-- STEP 4: Add some favorites and exchanges for realism
-- =====================================================
-- Add favorites
INSERT INTO favorites (user_id, listing_id) VALUES
    ('22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111'),
    ('33333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111112'),
    ('11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- Add some exchanges
INSERT INTO exchanges (id, giver_id, receiver_id, listing_id, status, created_at, updated_at) VALUES
    ('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111112', 'completed', NOW() - INTERVAL '10 days', NOW()),
    ('e2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333331', 'pending', NOW() - INTERVAL '1 day', NOW())
ON CONFLICT (id) DO NOTHING;

-- Update exchange counts in profiles
UPDATE profiles SET total_exchanges = 12 WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE profiles SET total_exchanges = 8 WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE profiles SET total_exchanges = 15 WHERE id = '33333333-3333-3333-3333-333333333333';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
SELECT 'Data seeding completed successfully!' AS status;
SELECT '3 users created with emails: student1@test.com, student2@test.com, student3@test.com' AS users;
SELECT 'Password for all users: password123' AS credentials;
SELECT '10 listings inserted with images and realistic data' AS listings;
