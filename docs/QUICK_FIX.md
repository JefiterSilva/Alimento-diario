# 🚨 Solução Rápida - Erro de Credenciais

## ❌ Problema Atual

- Erro: `permission denied for schema public`
- Erro: `Could not find the 'password_hash' column`
- Tabelas não existem no Supabase

## ✅ Solução

### 1. Criar Tabelas no Supabase

1. **Acesse o dashboard do Supabase**
2. **Vá em SQL Editor**
3. **Copie e cole o conteúdo do arquivo `create-tables.sql`**
4. **Execute o script**

### 2. Executar Seed dos Dados

```bash
npx dotenv-cli -e .env -- npx tsx src/lib/supabase-seed.ts
```

### 3. Testar Conexão

```bash
npx dotenv-cli -e .env -- node test-connection.js
```

### 4. Reiniciar Aplicação

```bash
npm run dev
```

## 🔧 Se ainda houver problemas:

### Verificar Credenciais

1. Acesse **Settings → API** no Supabase
2. Confirme que a URL e chave anônima estão corretas
3. Atualize o arquivo `.env` se necessário

### Recriar .env

```bash
node setup-env.js
```

## 📞 Próximos Passos

1. ✅ Criar tabelas no Supabase
2. ✅ Executar seed
3. ✅ Testar conexão
4. ✅ Reiniciar aplicação
5. ✅ Verificar funcionamento
