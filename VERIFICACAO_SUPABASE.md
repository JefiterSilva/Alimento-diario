# 🔍 Verificação da Configuração do Supabase

## ❌ Erro Atual

```
Invalid API key
Hint: Double check your Supabase `anon` or `service_role` API key.
```

## ✅ Soluções para Verificar

### 1. Verificar se o Projeto Supabase Existe

- Acesse [supabase.com](https://supabase.com)
- Faça login na sua conta
- Verifique se o projeto `alimento-diario` (ou o nome que você escolheu) está listado

### 2. Verificar as Credenciais da API

1. No dashboard do Supabase, clique no seu projeto
2. Vá em **Settings** → **API**
3. Verifique se:
   - **Project URL** é exatamente: `https://jkflvxyitauobqygcujh.supabase.co`
   - **anon public** key é a chave que está no seu `.env`

### 3. Verificar se as Tabelas Foram Criadas

1. No dashboard do Supabase, vá em **Table Editor**
2. Verifique se existem as seguintes tabelas:
   - `users`
   - `devotionals`
   - `tags`
   - `devotional_tags`

Se as tabelas **NÃO** existem, você precisa criá-las:

#### Criar Tabelas no SQL Editor

1. Vá em **SQL Editor** no dashboard do Supabase
2. Execute os comandos SQL do arquivo `SUPABASE_SETUP.md` (linhas 48-177)

### 4. Testar Conexão Simples

Use o comando:

```bash
npx dotenv-cli -e .env -- npx tsx src/lib/supabase-seed.ts
```

## 🆘 Se Nada Funcionar

1. **Recriar o projeto Supabase**:

   - Delete o projeto atual
   - Crie um novo projeto
   - Atualize as credenciais no `.env`
   - Execute os comandos SQL para criar as tabelas

2. **Verificar se a região está correta**:
   - Alguns projetos podem ter problemas de conectividade dependendo da região

## 📞 Próximos Passos

1. Verifique cada item acima
2. Se as tabelas não existem, crie-as usando os comandos SQL
3. Se as credenciais estão incorretas, atualize o arquivo `.env`
4. Teste novamente o comando de seed
