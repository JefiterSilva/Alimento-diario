# 🚨 SOLUÇÃO DEFINITIVA - Erro de Credenciais

## ❌ **Problema Atual**

- Erro: `permission denied for schema public`
- Erro: `Could not find the 'password_hash' column`
- **Tabelas não existem no Supabase**
- Aplicação não consegue carregar dados

## ✅ **SOLUÇÃO OBRIGATÓRIA**

### **PASSO 1: Criar Tabelas no Supabase (OBRIGATÓRIO)**

1. **Acesse o dashboard do Supabase:**

   - Vá para: https://supabase.com/dashboard
   - Faça login na sua conta
   - Selecione seu projeto

2. **Abra o SQL Editor:**

   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"New query"**

3. **Execute o script SQL:**

   - Copie TODO o conteúdo do arquivo `create-tables.sql`
   - Cole no editor SQL
   - Clique em **"Run"** (ou pressione Ctrl+Enter)

4. **Verifique se as tabelas foram criadas:**
   - No menu lateral, clique em **"Table Editor"**
   - Você deve ver as tabelas: `users`, `tags`, `devotionals`, `devotional_tags`

### **PASSO 2: Executar Seed dos Dados**

```bash
npx dotenv-cli -e .env -- npx tsx src/lib/supabase-seed.ts
```

### **PASSO 3: Testar Conexão**

```bash
npx dotenv-cli -e .env -- node test-connection.js
```

### **PASSO 4: Reiniciar Aplicação**

```bash
npm run dev
```

## 🔧 **Se ainda houver problemas:**

### **Verificar Credenciais**

1. No Supabase, vá em **Settings → API**
2. Confirme que a URL e chave anônima estão corretas
3. Atualize o arquivo `.env` se necessário

### **Recriar .env**

```bash
node setup-env.js
```

## 📋 **Checklist de Verificação**

- [ ] Tabelas criadas no Supabase
- [ ] Seed executado com sucesso
- [ ] Teste de conexão passou
- [ ] Aplicação carregando dados
- [ ] Sem erros no console

## 🆘 **Se nada funcionar:**

1. **Verifique se o projeto Supabase existe**
2. **Confirme que as credenciais estão corretas**
3. **Execute o script SQL manualmente**
4. **Reinicie a aplicação**

## 📞 **Próximos Passos**

1. ✅ Criar tabelas no Supabase (MANUAL)
2. ✅ Executar seed
3. ✅ Testar conexão
4. ✅ Reiniciar aplicação
5. ✅ Verificar funcionamento

---

**⚠️ IMPORTANTE: As tabelas DEVEM ser criadas manualmente no SQL Editor do Supabase!**
