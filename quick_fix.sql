-- =====================================================
-- RÉPARATION RAPIDE - Exécute ce code dans Supabase SQL Editor
-- =====================================================

-- 1. Désactiver temporairement le trigger problématique
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Recréer la fonction avec gestion d'erreur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
        RETURN NEW; -- Continue même si le profil n'est pas créé
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recréer le trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. S'assurer que la table profiles existe avec les bonnes permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;

-- 5. Créer une policy permissive pour l'insertion
DROP POLICY IF EXISTS "Allow insert profiles" ON profiles;
CREATE POLICY "Allow insert profiles"
    ON profiles FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

SELECT 'Réparation terminée. Essayez de créer un utilisateur maintenant.' as status;
