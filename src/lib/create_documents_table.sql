-- ============================================================
-- Migration: Tạo bảng documents cho hệ thống CMS
-- Chạy trong Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS documents (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  subtitle      TEXT,
  cover_emoji   TEXT DEFAULT '📄',
  category      TEXT NOT NULL DEFAULT 'du-an',
  content       TEXT NOT NULL DEFAULT '',
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_slug ON documents (slug);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents (category);
CREATE INDEX IF NOT EXISTS idx_documents_published ON documents (is_published, created_at DESC);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published documents"
  ON documents FOR SELECT USING (is_published = true);
