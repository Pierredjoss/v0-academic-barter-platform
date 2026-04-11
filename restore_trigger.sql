-- =====================================================
-- RESTAURER LE TRIGGER (après le test)
-- =====================================================

-- 1. Recréer la fonction
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
        RAISE LOG 'Erreur création profil pour %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Recréer le trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

SELECT 'Trigger restauré!' as status;
