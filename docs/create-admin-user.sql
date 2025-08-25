-- Script para criar um usuário admin padrão
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, garantir que a tabela users permite password_hash NULL
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Criar usuário admin padrão
INSERT INTO users (
  id,
  name,
  email,
  password_hash,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@exemplo.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: admin123
  'ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 3. Verificar se o usuário foi criado
SELECT 
  id,
  name,
  email,
  role,
  created_at
FROM users 
WHERE email = 'admin@exemplo.com';

-- 4. Mostrar todos os usuários (opcional)
SELECT 
  id,
  name,
  email,
  role,
  created_at
FROM users 
ORDER BY created_at DESC;
