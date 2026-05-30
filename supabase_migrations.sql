-- =====================================================
-- MIGRATIONS REQUISES POUR SUPABASE
-- Coller ces requêtes dans l'éditeur SQL de Supabase
-- =====================================================

-- 1. MISE À JOUR DE LA CONTRAINTE STATUS SUR LISTINGS
-- Supprimer l'ancienne contrainte et créer la nouvelle avec pending_payment
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE listings ADD CONSTRAINT listings_status_check 
  CHECK (status IN ('pending_payment', 'active', 'reserved', 'completed', 'archived'));

-- Mettre à jour les annonces existantes sans statut vers 'active'
UPDATE listings SET status = 'active' WHERE status IS NULL OR status = '';

-- 2. MISE À JOUR DE LA TABLE PAYMENTS (ajouter listing_id si pas présent)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES listings(id) ON DELETE CASCADE;

-- 3. VÉRIFICATION/DESACTIVATION CONFIRMATION EMAIL
-- Vérifier dans l'interface Supabase Auth > Configuration > Email Templates
-- Mettre "Confirm email" à OFF dans Auth > Configuration > Email Auth

-- 4. INDEX POUR AMÉLIORER LES PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_coordinates ON listings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_payments_listing_id ON payments(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read) WHERE read = false;

-- 5. FONCTION POUR INCRÉMENTER LES VUES (corrige le système de vues)
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings 
  SET views = views + 1 
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS POLICIES CORRIGÉES POUR CONVERSATIONS ET MESSAGES

-- Conversations : utilisateurs peuvent voir leurs conversations
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversations.id 
      AND user_id = auth.uid()
    )
  );

-- Conversation participants
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
CREATE POLICY "Users can view conversation participants" ON conversation_participants
  FOR SELECT USING (
    user_id = auth.uid() OR 
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;
CREATE POLICY "Users can add conversation participants" ON conversation_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Messages : utilisateurs peuvent voir les messages de leurs conversations
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

-- 7. POLICY PAYMENTS (permettre insertion après création listing)
DROP POLICY IF EXISTS "Users can insert their own payments" ON payments;
CREATE POLICY "Users can insert their own payments" ON payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 8. METADATA POUR STOCKER LE NUMÉRO DE TÉLÉPHONE
-- Le numéro sera stocké dans raw_user_meta_data de auth.users
-- ou dans profiles.phone
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- 9. TRIGGER POUR NOTIFICATIONS DE MESSAGES
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer une notification pour le destinataire
  INSERT INTO notifications (recipient_id, type, data)
  SELECT 
    cp.user_id,
    'new_message',
    jsonb_build_object(
      'conversation_id', NEW.conversation_id,
      'sender_id', NEW.sender_id,
      'preview', substring(NEW.content from 1 for 100)
    )
  FROM conversation_participants cp
  WHERE cp.conversation_id = NEW.conversation_id
  AND cp.user_id != NEW.sender_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_new_message ON messages;
CREATE TRIGGER trg_notify_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();

-- 10. CORRECTION NOTIFICATION TYPE listing_published
-- Vérifier que le type 'listing_published' est supporté
-- Ou utiliser un type générique

-- =====================================================
-- FIN DES MIGRATIONS
-- =====================================================
