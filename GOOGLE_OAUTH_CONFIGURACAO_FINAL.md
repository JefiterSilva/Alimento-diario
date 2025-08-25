# 🔧 Configuração Final do Google OAuth

## ✅ Problema Resolvido

O erro "Código de autorização não encontrado" foi resolvido. O problema era que estávamos tentando usar uma rota de callback personalizada, mas o Supabase gerencia o OAuth internamente.

## 🔧 Solução Implementada

### 1. Removida Rota de Callback Personalizada

- **Arquivo removido**: `src/app/auth/callback/route.ts`
- **Motivo**: O Supabase gerencia o OAuth internamente

### 2. Atualizada URL de Redirecionamento

- **Arquivo**: `src/lib/auth-context.tsx`
- **Mudança**: `redirectTo: ${window.location.origin}/admin`
- **Motivo**: Redirecionar diretamente para o painel admin

### 3. Adicionada Verificação Automática de Usuários OAuth

- **Arquivo**: `src/lib/supabase-auth.ts`
- **Função**: `checkAndCreateOAuthUser()`
- **Função**: Verifica e cria usuários OAuth automaticamente

### 4. Atualizado Listener de Autenticação

- **Arquivo**: `src/lib/auth-context.tsx`
- **Função**: Detecta usuários OAuth e os cria na tabela `users`

## 🔧 Configuração no Supabase Dashboard

### 1. Configurar Google OAuth

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Authentication** → **Providers**
4. Ative o provedor **Google**
5. Configure:
   - **Client ID**: Seu Google OAuth Client ID
   - **Client Secret**: Seu Google OAuth Client Secret

### 2. Configurar URLs de Redirecionamento

No Supabase Dashboard, vá para **Authentication** → **URL Configuration** e adicione:

```
http://localhost:3000/admin
http://localhost:3001/admin
https://seu-dominio.com/admin
```

## 🔧 Configuração no Google Cloud Console

### 1. Configurar URLs Autorizadas

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para **APIs & Services** → **Credentials**
3. Edite seu OAuth 2.0 Client ID
4. Adicione as URLs autorizadas:

**Origem JavaScript autorizada:**

```
https://lgeuqnjzlcgezwbqaytc.supabase.co
http://localhost:3000
```

**URI de redirecionamento autorizado:**

```
https://lgeuqnjzlcgezwbqaytc.supabase.co/auth/v1/callback
```

## 🧪 Testando a Configuração

### 1. Executar Script SQL (se ainda não executou)

Execute no SQL Editor do Supabase:

```sql
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
```

### 2. Testar o Login

1. Acesse `http://localhost:3000/login`
2. Clique em "Entrar com Google"
3. Faça login com sua conta Google
4. Verifique se foi redirecionado para `/admin`

### 3. Verificar Usuário Criado

1. No Supabase Dashboard, vá para **Table Editor**
2. Selecione a tabela `users`
3. Verifique se o usuário foi criado com `password_hash` como `null`

## 🎉 Resultado Esperado

Após a configuração:

- ✅ Login com Google funciona sem erros
- ✅ Usuário é redirecionado para `/admin`
- ✅ Usuário OAuth é criado automaticamente na tabela `users`
- ✅ `password_hash` é `null` para usuários OAuth
- ✅ Sessão é mantida corretamente

## 🔍 Logs para Debug

Observe os logs no console do navegador (F12):

- Deve aparecer: "Auth state changed: SIGNED_IN"
- Deve aparecer: "Usuário OAuth criado com sucesso" (se for novo usuário)

## 🐛 Possíveis Problemas

### Erro: "redirect_uri_mismatch"

- **Solução**: Verifique se as URLs estão configuradas corretamente no Google Cloud Console

### Erro: "invalid_client"

- **Solução**: Verifique se o Client ID e Client Secret estão corretos no Supabase

### Usuário não aparece no painel admin

- **Solução**: Verifique se o usuário foi criado na tabela `users` no Supabase

### Erro: "column password_hash does not allow null"

- **Solução**: Execute o script SQL para permitir NULL no campo password_hash

## 📋 Checklist Final

- [ ] Google OAuth ativo no Supabase
- [ ] URLs de redirecionamento configuradas no Supabase
- [ ] URLs autorizadas configuradas no Google Cloud Console
- [ ] Script SQL executado (password_hash permite NULL)
- [ ] Teste de login realizado com sucesso
- [ ] Usuário criado na tabela `users`
- [ ] Redirecionamento para `/admin` funcionando
