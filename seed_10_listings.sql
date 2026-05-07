-- =====================================================
-- ɖyɔ̌ - Academic Barter Platform - Seed 10 Listings
-- =====================================================
-- This script inserts 10 sample listings with images
-- Run this in Supabase SQL Editor
-- =====================================================

-- First, ensure we have the categories (they should already exist from the fallback or schema)
-- If categories don't exist, insert them
INSERT INTO categories (id, name, name_fr, icon, color) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'livres-cours', 'Matétiels et Fournitures', 'book-open', '#3b82f6'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'manuels', 'Manuels Scolaires & Livres', 'graduation-cap', '#8b5cf6'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'annales', 'Annales & Sujets d''Examens', 'file-text', '#f59e0b'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'notes-fiches', 'Notes de Cours & Fiches de Révision', 'notebook-pen', '#10b981'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'romans', 'Romans & Littérature', 'book-open', '#ec4899')
ON CONFLICT (name) DO UPDATE SET
    name_fr = EXCLUDED.name_fr,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color;

-- Create a function to get random user IDs (we'll use this for seeding)
-- NOTE: This requires existing users in the profiles table
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
    cat1_id UUID;
    cat2_id UUID;
    cat3_id UUID;
    cat4_id UUID;
    cat5_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO cat1_id FROM categories WHERE name = 'livres-cours' LIMIT 1;
    SELECT id INTO cat2_id FROM categories WHERE name = 'manuels' LIMIT 1;
    SELECT id INTO cat3_id FROM categories WHERE name = 'annales' LIMIT 1;
    SELECT id INTO cat4_id FROM categories WHERE name = 'notes-fiches' LIMIT 1;
    SELECT id INTO cat5_id FROM categories WHERE name = 'romans' LIMIT 1;

    -- Get some user IDs (you may need to adjust this based on your actual users)
    -- If you don't have users yet, run this AFTER creating users
    SELECT id INTO user1_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 0;
    SELECT id INTO user2_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 1;
    SELECT id INTO user3_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 2;

    -- Only proceed if we found users
    IF user1_id IS NOT NULL THEN
        -- Insert 10 sample listings
        INSERT INTO listings (user_id, title, description, category_id, condition, exchange_type, city, status, images, views) VALUES
            (user1_id, 
             'Manuel de Mathématiques Terminale S', 
             'Manuel complet de mathématiques pour la terminale scientifique. Très bon état, quelques annotations au crayon. Idéal pour réviser le bac.', 
             cat2_id, 'good', 'in_person', 'Cotonou', 'active', 
             ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=600&fit=crop'],
             15),
            
            (user1_id, 
             'Annales BAC 2020-2023 Physique-Chimie', 
             'Collection complète des sujets de BAC en physique-chimie avec corrigés détaillés. Indispensable pour la préparation.', 
             cat3_id, 'like_new', 'both', 'Cotonou', 'active', 
             ARRAY['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop'],
             23),
            
            (user2_id, 
             'Cours de Droit Constitutionnel L1', 
             'Fiches de révision complètes pour le droit constitutionnel. Résumés des articles et jurisprudences importantes.', 
             cat4_id, 'new', 'delivery', 'Parakou', 'active', 
             ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=600&fit=crop'],
             8),
            
            (user2_id, 
             'Roman - L''Étranger d''Albert Camus', 
             'Édition de poche de L''Étranger. État correct, quelques marques d''usage mais très lisible.', 
             cat5_id, 'fair', 'in_person', 'Abomey-Calavi', 'active', 
             ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop'],
             42),
            
            (user3_id, 
             'Manuel d''Économie Générale BTS', 
             'Manuel complet pour les étudiants en BTS économie. Tous les chapitres du programme avec exercices corrigés.', 
             cat2_id, 'new', 'delivery', 'Porto-Novo', 'active', 
             ARRAY['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=600&fit=crop'],
             12),
            
            (user1_id, 
             'Livre - Chimie Organique Avancée', 
             'Ouvrage de référence pour la chimie organique. Parfait pour les études de médecine et pharmacie.', 
             cat1_id, 'like_new', 'in_person', 'Cotonou', 'active', 
             ARRAY['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=600&fit=crop'],
             31),
            
            (user3_id, 
             'Sujets d''Examens L2 Droit des Affaires', 
             'Compilation des partiels des 5 dernières années. Avec corrigés et conseils de méthodologie.', 
             cat3_id, 'good', 'both', 'Parakou', 'active', 
             ARRAY['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'],
             19),
            
            (user2_id, 
             'Fiches de Philosophie - La Morale', 
             'Fiches synthétiques sur les notions de morale. Citations, auteurs et arguments clés.', 
             cat4_id, 'new', 'in_person', 'Abomey-Calavi', 'active', 
             ARRAY['https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&h=600&fit=crop'],
             27),
            
            (user1_id, 
             'Les Misérables - Victor Hugo (édition complète)', 
             'Édition intégrale des Misérables. Reliure solide, pages en bon état. Classique de la littérature française.', 
             cat5_id, 'good', 'delivery', 'Cotonou', 'active', 
             ARRAY['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop'],
             56),
            
            (user3_id, 
             'Support de Cours - Programmation Python', 
             'Cours complet de programmation Python pour débutants et intermédiaires. Exemples pratiques inclus.', 
             cat1_id, 'like_new', 'both', 'Porto-Novo', 'active', 
             ARRAY['https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop'],
             34);
            
        RAISE NOTICE '10 listings inserted successfully!';
    ELSE
        RAISE NOTICE 'No users found. Please create users first, then run this script again.';
    END IF;
END $$;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
SELECT 'Listings seeding completed! Check the messages above for details.' AS status;
