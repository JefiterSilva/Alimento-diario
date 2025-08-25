-- Script para adicionar author_id à tabela de devocionais
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar coluna author_id à tabela devotionals
ALTER TABLE devotionals ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES users(id);

-- 2. Atualizar devocionais existentes para associar com o primeiro usuário admin
-- (assumindo que existe pelo menos um usuário admin)
UPDATE devotionals 
SET author_id = (
  SELECT id FROM users 
  WHERE role = 'ADMIN' 
  ORDER BY created_at ASC 
  LIMIT 1
)
WHERE author_id IS NULL;

-- 3. Tornar a coluna author_id obrigatória após atualizar os dados existentes
ALTER TABLE devotionals ALTER COLUMN author_id SET NOT NULL;

-- 4. Criar índice para melhorar performance das consultas por autor
CREATE INDEX IF NOT EXISTS idx_devotionals_author_id ON devotionals(author_id);

-- 5. Atualizar políticas RLS para incluir filtro por autor
DROP POLICY IF EXISTS "Anyone can read published devotionals" ON devotionals;
CREATE POLICY "Anyone can read published devotionals" ON devotionals 
FOR SELECT USING (published = true);

-- 6. Política para usuários verem apenas seus próprios devocionais (admin pode ver todos)
CREATE POLICY "Users can manage their own devotionals" ON devotionals 
FOR ALL USING (
  author_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'ADMIN'
  )
);

-- 7. Verificar a estrutura atualizada
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'devotionals' 
ORDER BY ordinal_position;

-- 8. Verificar devocionais com seus autores
SELECT 
  d.id,
  d.title,
  d.author,
  u.name as author_name,
  u.email as author_email,
  u.role as author_role
FROM devotionals d
LEFT JOIN users u ON d.author_id = u.id
ORDER BY d.created_at DESC;
