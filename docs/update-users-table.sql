-- Script para atualizar a tabela users no Supabase
-- Execute este script no SQL Editor do Supabase para permitir usuários OAuth

-- 1. Alterar a coluna password_hash para permitir NULL
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Adicionar comentário explicativo
COMMENT ON COLUMN users.password_hash IS 'Pode ser NULL para usuários OAuth (Google, etc.)';

-- 3. Verificar se a alteração foi aplicada
SELECT 
  column_name, 
  is_nullable, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'password_hash';
