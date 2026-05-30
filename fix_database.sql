-- =====================================================
-- DIAGNOSTIC ET RÉPARATION - Base de données Bénin
-- =====================================================

-- 1. VÉRIFIER LES TABLES EXISTANTES
SELECT 'TABLES EXISTANTES:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- 2. SUPPRIMER LE TRIGGER PROBLÉMATIQUE TEMPORAIREMENT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. RECRÉER LA FONCTION SANS LE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Vérifier si le profil existe déjà
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (
            NEW.id, 
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur')
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RECRÉER LE TRIGGER
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 5. VÉRIFIER QUE TOUTES LES TABLES EXISTENT
SELECT 'VERIFICATION TABLES:' as info;

-- Vérifier profiles
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles')
    THEN '✓ Table profiles existe'
    ELSE '✗ Table profiles MANQUANTE'
END as status;

-- Vérifier categories
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories')
    THEN '✓ Table categories existe'
    ELSE '✗ Table categories MANQUANTE'
END as status;

-- Vérifier listings
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'listings')
    THEN '✓ Table listings existe'
    ELSE '✗ Table listings MANQUANTE'
END as status;

-- =====================================================
-- CRÉATION DES UTILISATEURS VIA SQL (Méthode alternative)
-- =====================================================

-- Désactiver temporairement le trigger pour créer les utilisateurs manuellement
-- Puis réactiver après

-- Note: La création d'utilisateurs via SQL dans auth.users nécessite des privilèges spéciaux
-- C'est pourquoi on utilise l'API ou l'interface

SELECT '========================================' as separator;
SELECT 'Base de données reparée!' as status;
SELECT '========================================' as separator;
SELECT 'Maintenant, essaye de creer les utilisateurs via l interface Supabase.' as instruction;
