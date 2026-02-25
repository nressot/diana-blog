-- Table pour gerer l'acces au site (public/prive)
-- Executer ce SQL dans le SQL Editor de Supabase Dashboard

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  is_public BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserer la configuration initiale (site prive par defaut)
INSERT INTO site_settings (id, is_public)
VALUES ('main', false)
ON CONFLICT (id) DO NOTHING;

-- Politique RLS pour lecture publique
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON site_settings
  FOR SELECT USING (true);

-- Politique pour mise a jour (via service role uniquement)
CREATE POLICY "Allow service role update" ON site_settings
  FOR UPDATE USING (true);
