-- Script para criar as tabelas no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- Removido NOT NULL para permitir usuários OAuth
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de devocionais
CREATE TABLE IF NOT EXISTS devotionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  bible_verse TEXT NOT NULL,
  bible_reference VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de relacionamento devocional-tags
CREATE TABLE IF NOT EXISTS devotional_tags (
  devotional_id UUID REFERENCES devotionals(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (devotional_id, tag_id)
);

-- 5. Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devotionals_updated_at BEFORE UPDATE ON devotionals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Configurar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotional_tags ENABLE ROW LEVEL SECURITY;

-- 8. Criar políticas de acesso
-- Política para usuários (temporariamente permitir tudo)
CREATE POLICY "Allow all users" ON users FOR ALL USING (true);

-- Política para tags (todos podem ler)
CREATE POLICY "Anyone can read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Allow all tags" ON tags FOR ALL USING (true);

-- Política para devocionais (todos podem ler publicados)
CREATE POLICY "Anyone can read published devotionals" ON devotionals FOR SELECT USING (published = true);
CREATE POLICY "Allow all devotionals" ON devotionals FOR ALL USING (true);

-- Política para devotional_tags (todos podem ler)
CREATE POLICY "Anyone can read devotional_tags" ON devotional_tags FOR SELECT USING (true);
CREATE POLICY "Allow all devotional_tags" ON devotional_tags FOR ALL USING (true);
