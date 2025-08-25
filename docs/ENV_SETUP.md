# 🔧 Configuração Rápida das Variáveis de Ambiente

## ❌ Erro Atual

O erro `supabaseUrl is required` ocorre porque as variáveis de ambiente do Supabase não estão configuradas.

## ✅ Solução

### Opção 1: Usar o Script Automático

```bash
node setup-env.js
```

### Opção 2: Configuração Manual

1. **Crie um arquivo `.env` na raiz do projeto** com o seguinte conteúdo:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

2. **Obtenha as credenciais do Supabase:**

   - Acesse [supabase.com](https://supabase.com)
   - Crie uma conta e um novo projeto
   - Vá em **Settings** → **API**
   - Copie o **Project URL** e **anon public** key

3. **Substitua os valores no arquivo `.env`**

4. **Execute o seed:**

```bash
npx tsx src/lib/supabase-seed.ts
```

## 📚 Documentação Completa

Para instruções detalhadas sobre como configurar o Supabase, consulte `SUPABASE_SETUP.md`
