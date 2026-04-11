-- =====================================================
-- SEED USERS BÉNIN - Emails corrigés (plus longs)
-- =====================================================

-- =====================================================
-- UTILISATEUR 1: Koffi (Étudiant à Abomey-Calavi)
-- Email: koffi.mensah@uac.edu.bj (plus long)
-- =====================================================
INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'koffi.mensah@uac.edu.bj',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Koffi Mensah","university":"Universite d''Abomey-Calavi","city":"Abomey-Calavi"}',
    NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

UPDATE profiles SET
    full_name = 'Koffi Mensah',
    university = 'Universite d''Abomey-Calavi (UAC)',
    city = 'Abomey-Calavi',
    email = 'koffi.mensah@uac.edu.bj'
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- =====================================================
-- UTILISATEUR 2: Aminata (Étudiante à Cotonou)
-- Email: aminata.bakary@epac.edu.bj (plus long)
-- =====================================================
INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'aminata.bakary@epac.edu.bj',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Aminata Bakary","university":"Ecole Polytechnique d''Abomey-Calavi","city":"Cotonou"}',
    NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

UPDATE profiles SET
    full_name = 'Aminata Bakary',
    university = 'Ecole Polytechnique d''Abomey-Calavi (EPAC)',
    city = 'Cotonou',
    email = 'aminata.bakary@epac.edu.bj'
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- =====================================================
-- UTILISATEUR 3: Papa (Étudiant à Parakou)
-- Email: papa.ali@universite-parakou.edu.bj (plus long)
-- =====================================================
INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    'papa.ali@universite-parakou.edu.bj',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Papa Ali","university":"Universite de Parakou","city":"Parakou"}',
    NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

UPDATE profiles SET
    full_name = 'Papa Ali',
    university = 'Universite de Parakou (UP)',
    city = 'Parakou',
    email = 'papa.ali@universite-parakou.edu.bj'
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- =====================================================
-- RÉCAPITULATIF
-- =====================================================
SELECT 'UTILISATEURS BÉNINOIS CRÉÉS (EMAILS CORRIGÉS):' as info;
SELECT 'koffi.mensah@uac.edu.bj / Password123!' as user1;
SELECT 'aminata.bakary@epac.edu.bj / Password123!' as user2;
SELECT 'papa.ali@universite-parakou.edu.bj / Password123!' as user3;
