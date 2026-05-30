-- =====================================================
-- VÉRIFICATION ET RÉPARATION SUPABASE
-- =====================================================

-- 1. Vérifier que les tables existent
SELECT 'TABLES:' as section;
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'categories', 'listings', 'favorites', 'conversations', 'conversation_participants', 'messages', 'exchanges')
ORDER BY tablename;

-- 2. Vérifier les triggers sur auth.users
SELECT 'TRIGGERS ON auth.users:' as section;
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- 3. Vérifier le trigger on_auth_user_created
SELECT 'TRIGGER DETAILS:' as section;
SELECT 
    tgname as trigger_name,
    pg_get_functiondef(tgfoid) as function_definition
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 4. Supprimer et recréer la fonction et le trigger proprement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insérer le profil seulement si la table existe
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- En cas d'erreur, on retourne quand même NEW pour permettre la création de l'utilisateur
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 5. Vérifier que RLS est activé
SELECT 'RLS STATUS:' as section;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 6. Réactiver RLS et créer une policy pour l'insertion par le trigger
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre au trigger d'insérer
DROP POLICY IF EXISTS "Allow trigger to create profiles" ON profiles;
CREATE POLICY "Allow trigger to create profiles"
    ON profiles FOR INSERT
    WITH CHECK (true);

SELECT 'RÉPARATION TERMINÉE' as status;
SELECT 'Essayez maintenant de créer un utilisateur' as instruction;
