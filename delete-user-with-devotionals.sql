-- Script para configurar CASCADE DELETE e permitir deletar usuários com seus devocionais
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar a constraint atual
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='devotionals' 
    AND kcu.column_name='author_id';

-- 2. Verificar quantos devocionais cada usuário tem
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(d.id) as total_devotionals
FROM users u
LEFT JOIN devotionals d ON u.id = d.author_id
GROUP BY u.id, u.name, u.email
ORDER BY total_devotionals DESC;

-- 3. Alterar a constraint para CASCADE DELETE
-- Isso vai deletar automaticamente todos os devocionais quando o usuário for deletado
ALTER TABLE devotionals 
DROP CONSTRAINT IF EXISTS devotionals_author_id_fkey;

ALTER TABLE devotionals 
ADD CONSTRAINT devotionals_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES users(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- 4. Verificar se a constraint foi alterada corretamente
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='devotionals' 
    AND kcu.column_name='author_id';

-- 5. Testar a funcionalidade (opcional - descomente para testar)
-- DELETE FROM users WHERE id = 'test-user-id';
