# 🔐 Configuração do Google OAuth no Supabase

Este guia explica como configurar o login com Google no Supabase para o projeto de devocionais.

## 📋 Pré-requisitos

1. Conta no Google Cloud Console
2. Projeto Supabase configurado
3. Acesso ao dashboard do Supabase

## 🚀 Passo a Passo

### 1. Configurar Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ (se necessário)
4. Vá para "Credenciais" → "Criar credenciais" → "ID do cliente OAuth 2.0"
5. Configure o tipo de aplicativo como "Aplicativo da Web"
6. Adicione as URLs autorizadas:
   - **Origem JavaScript autorizada**: `https://[SEU-PROJETO].supabase.co`
   - **URI de redirecionamento autorizado**: `https://[SEU-PROJETO].supabase.co/auth/v1/callback`

### 2. Configurar Supabase

1. Acesse o dashboard do Supabase
2. Vá para "Authentication" → "Providers"
3. Ative o provedor "Google"
4. Preencha os campos:
   - **Client ID**: ID do cliente OAuth do Google
   - **Client Secret**: Chave secreta do cliente OAuth do Google

### 3. Configurar URLs de Redirecionamento

No Supabase, vá para "Authentication" → "URL Configuration" e adicione:

```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
https://[SEU-DOMINIO].com/auth/callback
```

### 4. Configurar Políticas de Segurança

No SQL Editor do Supabase, execute:

```sql
-- Permitir que usuários autenticados pelo Google acessem o painel admin
CREATE POLICY "Allow Google users to access admin" ON users
FOR ALL USING (
  auth.uid() = id OR
  role = 'ADMIN'
);
```

## 🔧 Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas no `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[SEU-PROJETO].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA-CHAVE-ANONIMA]
```

## 🧪 Testando

1. Inicie o servidor: `npm run dev`
2. Acesse `/login`
3. Clique em "Entrar com Google"
4. Faça login com sua conta Google
5. Verifique se foi redirecionado para `/admin`

## 🛠️ Solução de Problemas

### Erro: "redirect_uri_mismatch"

- Verifique se as URLs de redirecionamento estão corretas no Google Cloud Console
- Certifique-se de que o domínio do Supabase está incluído

### Erro: "invalid_client"

- Verifique se o Client ID e Client Secret estão corretos no Supabase
- Certifique-se de que o projeto do Google Cloud está ativo

### Usuário não aparece no painel admin

- Verifique se o usuário foi criado na tabela `users`
- Confirme se o role está definido como 'ADMIN'

## 📚 Recursos Adicionais

- [Documentação do Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Configuração de Provedores OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)

## ✅ Checklist

- [ ] Google Cloud Console configurado
- [ ] Credenciais OAuth criadas
- [ ] URLs de redirecionamento configuradas
- [ ] Supabase Auth configurado
- [ ] Políticas de segurança aplicadas
- [ ] Teste de login realizado
- [ ] Redirecionamento funcionando
