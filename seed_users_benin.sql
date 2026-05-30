-- =====================================================
-- SEED USERS - 3 utilisateurs de test (BÉNIN)
-- =====================================================
-- À exécuter dans Supabase SQL Editor après le schema
-- =====================================================

-- =====================================================
-- UTILISATEUR 1: Koffi (Étudiant à Abomey-Calavi)
-- =====================================================
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'koffi@uac.bj',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Koffi Mensah","university":"Universite d''Abomey-Calavi (UAC)","city":"Abomey-Calavi"}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

UPDATE profiles SET
    full_name = 'Koffi Mensah',
    university = 'Universite d''Abomey-Calavi (UAC)',
    city = 'Abomey-Calavi',
    email = 'koffi@uac.bj'
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- =====================================================
-- UTILISATEUR 2: Aminata (Étudiante à Cotonou)
-- =====================================================
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'aminata@epac.bj',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Aminata Bakary","university":"Ecole Polytechnique d''Abomey-Calavi (EPAC)","city":"Cotonou"}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

UPDATE profiles SET
    full_name = 'Aminata Bakary',
    university = 'Ecole Polytechnique d''Abomey-Calavi (EPAC)',
    city = 'Cotonou',
    email = 'aminata@epac.bj'
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- =====================================================
-- UTILISATEUR 3: Papa (Étudiant à Parakou)
-- =====================================================
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    'papa@up.bj',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Papa Ali","university":"Université de Parakou (UP)","city":"Parakou"}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

UPDATE profiles SET 
    full_name = 'Papa Ali',
    university = 'Université de Parakou (UP)',
    city = 'Parakou',
    email = 'papa@up.bj'
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- =====================================================
-- ANNONCES DE TEST (BÉNIN)
-- =====================================================

-- Annonce 1: Livre de math (Koffi a Abomey-Calavi)
INSERT INTO listings (id, user_id, title, description, category_id, condition, exchange_type, city, status, views, created_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Manuel de Mathematiques L1-L2 - Analyse et Algebre',
    'Livre complet pour les cours de mathematiques a l''UAC. Tres bon etat, quelques annotations au crayon. Ideal pour les etudiants en licence scientifique. Disponible sur le campus d''Abomey-Calavi.',
    id,
    'good',
    'in_person',
    'Abomey-Calavi',
    'active',
    15,
    NOW()
FROM categories WHERE name = 'books'
ON CONFLICT (id) DO NOTHING;

-- Annonce 2: Notes de cours (Aminata a Cotonou)
INSERT INTO listings (id, user_id, title, description, category_id, condition, exchange_type, city, status, views, created_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'Notes EPAC - Genie Civil et Construction',
    'Notes completes des 3 annees de genie civil a l''EPAC. Inclus les TD corriges, examens passes et resumes de cours. Format PDF + version imprimee disponible. Quartier Ganhi, Cotonou.',
    id,
    'like_new',
    'both',
    'Cotonou',
    'active',
    12,
    NOW()
FROM categories WHERE name = 'notes'
ON CONFLICT (id) DO NOTHING;

-- Annonce 3: Materiel labo (Papa a Parakou)
INSERT INTO listings (id, user_id, title, description, category_id, condition, exchange_type, city, status, views, created_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'Kit Laboratoire Biologie Chimie',
    'Materiel complet pour les TP de biologie et chimie : microscope, tubes a essai, pipettes, lames et lamelles. Achete pour licence mais peu utilise. Universite de Parakou, campus UP.',
    id,
    'like_new',
    'in_person',
    'Parakou',
    'active',
    8,
    NOW()
FROM categories WHERE name = 'lab-equipment'
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- RÉCAPITULATIF
-- =====================================================
SELECT 
    'UTILISATEURS BÉNINOIS CRÉÉS:' AS info,
    'Koffi - koffi@uac.bj / Password123! (UAC - Abomey-Calavi)' AS user1,
    'Aminata - aminata@epac.bj / Password123! (EPAC - Cotonou)' AS user2,
    'Papa - papa@up.bj / Password123! (UP - Parakou)' AS user3;

SELECT COUNT(*) AS total_users FROM profiles;
SELECT COUNT(*) AS total_listings FROM listings;
