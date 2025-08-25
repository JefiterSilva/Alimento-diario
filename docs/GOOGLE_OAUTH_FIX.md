# 🔧 Correção do Login com Google OAuth

## ❌ Problema Identificado

O erro `SyntaxError: Unexpected token '<', "<!DOCTYPE "...` ocorria porque:

1. A rota `/auth/callback` não existia
2. O Google OAuth tentava redirecionar para uma URL que retornava HTML (página 404) em vez de JSON

## ✅ Soluções Implementadas

### 1. Criada a Rota de Callback

- **Arquivo**: `src/app/auth/callback/route.ts`
- **Função**: Processa o retorno do Google OAuth
- **Ações**:
  - Troca o código de autorização por uma sessão
  - Verifica se o usuário existe na tabela `users`
  - Cria um novo usuário se necessário
  - Redireciona para `/admin` após sucesso

### 2. Atualizada a URL de Redirecionamento

- **Arquivo**: `src/lib/auth-context.tsx`
- **Mudança**: `redirectTo: ${window.location.origin}/auth/callback`
- **Antes**: `redirectTo: ${window.location.origin}/admin`

### 3. Melhorado o Tratamento de Erros

- **Arquivo**: `src/app/login/page.tsx`
- **Adicionado**: Captura de erros da URL de callback
- **Função**: Exibe mensagens de erro específicas

## 🔧 Configuração Necessária no Supabase

### 1. Configurar Google OAuth no Supabase Dashboard

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Authentication** → **Providers**
4. Ative o provedor **Google**
5. Configure:
   - **Client ID**: Seu Google OAuth Client ID
   - **Client Secret**: Seu Google OAuth Client Secret

### 2. Configurar URLs de Redirecionamento no Google Cloud Console

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
http://localhost:3000/auth/callback
```

### 3. Configurar URLs no Supabase

No Supabase Dashboard, vá para **Authentication** → **URL Configuration** e adicione:

```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
https://seu-dominio.com/auth/callback
```

## 🧪 Testando a Correção

1. **Inicie o servidor**:

   ```bash
   npm run dev
   ```

2. **Acesse a página de login**:

   ```
   http://localhost:3000/login
   ```

3. **Clique em "Entrar com Google"**

4. **Verifique se**:
   - Não há mais erro de JSON inválido
   - O redirecionamento funciona corretamente
   - O usuário é criado na tabela `users`
   - O redirecionamento para `/admin` funciona

## 🐛 Possíveis Problemas e Soluções

### Erro: "redirect_uri_mismatch"

- **Causa**: URL de redirecionamento não configurada no Google Cloud Console
- **Solução**: Adicione `http://localhost:3000/auth/callback` nas URIs autorizadas

### Erro: "invalid_client"

- **Causa**: Client ID ou Client Secret incorretos
- **Solução**: Verifique as credenciais no Supabase Dashboard

### Usuário não aparece no painel admin

- **Causa**: Usuário não foi criado na tabela `users`
- **Solução**: Verifique os logs do callback para erros de inserção

### Erro: "Código de autorização não encontrado"

- **Causa**: Problema na configuração do OAuth
- **Solução**: Verifique se o Google OAuth está ativo no Supabase

## 📋 Checklist de Verificação

- [ ] Google OAuth ativo no Supabase
- [ ] URLs de redirecionamento configuradas no Google Cloud Console
- [ ] URLs de redirecionamento configuradas no Supabase
- [ ] Rota `/auth/callback` funcionando
- [ ] Teste de login realizado com sucesso
- [ ] Usuário criado na tabela `users`
- [ ] Redirecionamento para `/admin` funcionando

## 🔍 Logs para Debug

Para verificar se está funcionando, observe os logs no console do navegador e no terminal do servidor. A rota de callback deve aparecer nos logs quando o Google OAuth retornar.
