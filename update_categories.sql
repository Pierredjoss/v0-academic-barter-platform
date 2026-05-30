-- =====================================================
-- ɖyɔ̌ - Academic Barter Platform - Update Categories
-- =====================================================
-- Run this in Supabase SQL Editor to update categories
-- =====================================================

-- Delete existing categories (listings will have NULL category_id)
DELETE FROM categories;

-- Insert new categories as requested
INSERT INTO categories (id, name, name_fr, icon, color) VALUES
    (uuid_generate_v4(), 'livres-cours', 'Livres et Supports de Cours', 'book-open', '#3b82f6'),
    (uuid_generate_v4(), 'manuels', 'Manuels Scolaires & Livres', 'graduation-cap', '#8b5cf6'),
    (uuid_generate_v4(), 'annales', 'Annales & Sujets d\'Examens', 'file-text', '#f59e0b'),
    (uuid_generate_v4(), 'notes-fiches', 'Notes de Cours & Fiches de Révision', 'notebook-pen', '#10b981'),
    (uuid_generate_v4(), 'romans', 'Romans & Littérature', 'book-open', '#ec4899')
ON CONFLICT (name) DO UPDATE SET
    name_fr = EXCLUDED.name_fr,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
SELECT 'Categories updated successfully!' AS status;
