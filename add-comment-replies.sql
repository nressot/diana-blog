-- Migration: Ajouter le support des reponses aux commentaires
-- A executer dans Supabase SQL Editor

-- 1. Ajouter les colonnes manquantes a la table comments
ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS author_avatar TEXT;

-- 2. Creer un index pour les reponses
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- 3. Ajouter une politique RLS pour que tout le monde puisse voir les reponses approuvees
-- (deja gere par la politique existante "Approved comments are viewable by everyone")

-- 4. Mettre a jour la politique d'insertion pour supporter les reponses
-- La politique "Anyone can submit comments" couvre deja les reponses

-- Verification: Afficher la structure de la table
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;
