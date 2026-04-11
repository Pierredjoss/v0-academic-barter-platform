-- =====================================================
-- DIAGNOSTIC COMPLET ET RÉPARATION
-- Exécute TOUT ce code dans Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PARTIE 1: SUPPRIMER TOUT CE QUI POSE PROBLÈME
-- =====================================================

-- Supprimer tous les triggers sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Supprimer la fonction
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Supprimer les tables si elles existent (avec CASCADE pour les dépendances)
DROP TABLE IF EXISTS exchanges CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =====================================================
-- PARTIE 2: RECRÉER TOUTES LES TABLES
-- =====================================================

-- Table: profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    university TEXT,
    city TEXT,
    bio TEXT,
    avatar_url TEXT,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_exchanges INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    name_fr TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'package',
    color TEXT NOT NULL DEFAULT '#6366f1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert categories
INSERT INTO categories (name, name_fr, icon, color) VALUES
    ('books', 'Livres', 'book-open', '#3b82f6'),
    ('notes', 'Notes de Cours', 'notebook-pen', '#10b981'),
    ('lab-equipment', 'Materiel Labo', 'flask-conical', '#f59e0b'),
    ('study-materials', 'Materiel Etude', 'graduation-cap', '#8b5cf6'),
    ('documents', 'Documents', 'file-text', '#ec4899'),
    ('other', 'Autre', 'package', '#6b7280')
ON CONFLICT (name) DO NOTHING;

-- Table: listings
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
    exchange_type TEXT NOT NULL DEFAULT 'in_person' CHECK (exchange_type IN ('in_person', 'delivery', 'both')),
    city TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'completed', 'archived')),
    views INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: favorites
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- Table: conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: conversation_participants
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

-- Table: messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: exchanges
CREATE TABLE exchanges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    giver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PARTIE 3: RLS (Row Level Security)
-- =====================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Profiles viewable" ON profiles;
CREATE POLICY "Profiles viewable" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profiles insert" ON profiles;
CREATE POLICY "Profiles insert" ON profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Profiles update own" ON profiles;
CREATE POLICY "Profiles update own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings policies
DROP POLICY IF EXISTS "Listings viewable" ON listings;
CREATE POLICY "Listings viewable" ON listings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Listings insert" ON listings;
CREATE POLICY "Listings insert" ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Listings update own" ON listings;
CREATE POLICY "Listings update own" ON listings FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Listings delete own" ON listings;
CREATE POLICY "Listings delete own" ON listings FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
DROP POLICY IF EXISTS "Favorites view own" ON favorites;
CREATE POLICY "Favorites view own" ON favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Favorites insert" ON favorites;
CREATE POLICY "Favorites insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Favorites delete own" ON favorites;
CREATE POLICY "Favorites delete own" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
DROP POLICY IF EXISTS "Conversations view" ON conversations;
CREATE POLICY "Conversations view" ON conversations FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid())
);

-- Conversation participants policies
DROP POLICY IF EXISTS "Participants view" ON conversation_participants;
CREATE POLICY "Participants view" ON conversation_participants FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversation_participants AS cp WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Participants insert" ON conversation_participants;
CREATE POLICY "Participants insert" ON conversation_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages policies
DROP POLICY IF EXISTS "Messages view" ON messages;
CREATE POLICY "Messages view" ON messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Messages insert" ON messages;
CREATE POLICY "Messages insert" ON messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- Exchanges policies
DROP POLICY IF EXISTS "Exchanges view" ON exchanges;
CREATE POLICY "Exchanges view" ON exchanges FOR SELECT USING (auth.uid() = giver_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Exchanges insert" ON exchanges;
CREATE POLICY "Exchanges insert" ON exchanges FOR INSERT WITH CHECK (auth.uid() = giver_id OR auth.uid() = receiver_id);

-- =====================================================
-- PARTIE 4: TRIGGER CRÉATION AUTOMATIQUE DU PROFIL
-- =====================================================

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

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PARTIE 5: GRANTS (Permissions)
-- =====================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO service_role;

-- =====================================================
-- VÉRIFICATION FINALE
-- =====================================================

SELECT 'TABLES CRÉÉES:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

SELECT 'TRIGGER ACTIF:' as info;
SELECT trigger_name FROM information_schema.triggers WHERE event_object_schema = 'auth' AND event_object_table = 'users';

SELECT '========================================' as separator;
SELECT 'BASE DE DONNÉES RÉPARÉE!' as status;
SELECT '========================================' as separator;
SELECT 'Tu peux maintenant créer des utilisateurs via l application' as instruction;
