-- =====================================================
-- TEST: Désactiver le trigger pour diagnostic
-- =====================================================

-- 1. Supprimer temporairement le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. S'assurer que la table profiles existe et est accessible
SELECT 'Table profiles existe:' as info, COUNT(*) as count FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';

-- 3. Vérifier les permissions sur la table profiles
SELECT 'Permissions profiles:' as info;
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_schema = 'public' AND table_name = 'profiles';

-- 4. Tester l'insertion manuelle dans profiles (simulation)
-- Note: Ceci échouera car il n'y a pas d'utilisateur, mais ça teste les permissions

SELECT '========================================' as sep;
SELECT 'TRIGGER SUPPRIMÉ TEMPORAIREMENT' as status;
SELECT '========================================' as sep;
SELECT 'Essaye de créer un utilisateur maintenant.' as instruction;
SELECT 'Si ça marche, le problème vient du trigger.' as instruction2;
SELECT 'Si ça ne marche pas, le problème vient de Supabase Auth (config email, rate limit, etc.)' as instruction3;
