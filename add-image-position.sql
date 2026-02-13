-- Ajouter la colonne image_position a la table articles
-- A executer dans Supabase SQL Editor

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center';

-- Valeurs possibles: 'top', 'center', 'bottom'
COMMENT ON COLUMN articles.image_position IS 'Position verticale de l image de couverture (top, center, bottom)';
