# 🔧 Solução para Erro Persistente do Google OAuth

## ❌ Problema Atual

O erro `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` continua aparecendo mesmo após as correções anteriores.

## 🔍 Análise do Problema

Este erro indica que:

1. O Google OAuth está tentando fazer uma requisição
2. A resposta está retornando HTML (provavelmente uma página de erro)
3. O código está tentando fazer `JSON.parse()` em HTML

## 🔧 Soluções Implementadas

### 1. ✅ Removida Rota de Callback Personalizada

- Arquivo `src/app/auth/callback/route.ts` removido
- O Supabase gerencia o OAuth internamente

### 2. ✅ Atualizada URL de Redirecionamento

- Mudança: `redirectTo: ${window.location.origin}`
- Redireciona para a página inicial

### 3. ✅ Adicionado Tratamento de Erro na Página Admin

- Tratamento de erro na página admin
- Exibe mensagem de erro amigável

### 4. ✅ Verificação Automática de Usuários OAuth

- Função `checkAndCreateOAuthUser()` implementada
- Cria usuários OAuth automaticamente

## 🔧 Configuração Necessária

### 1. Executar Script SQL no Supabase

```sql
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
```

### 2. Configurar Google OAuth no Supabase Dashboard

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **Authentication** → **Providers**
3. Ative o provedor **Google**
4. Configure Client ID e Client Secret

### 3. Configurar URLs no Google Cloud Console

**Origem JavaScript autorizada:**

```
https://lgeuqnjzlcgezwbqaytc.supabase.co
http://localhost:3000
```

**URI de redirecionamento autorizado:**

```
https://lgeuqnjzlcgezwbqaytc.supabase.co/auth/v1/callback
```

### 4. Configurar URLs no Supabase

No Supabase Dashboard, vá para **Authentication** → **URL Configuration** e adicione:

```
http://localhost:3000
http://localhost:3001
```

## 🧪 Teste Alternativo

Se o problema persistir, teste esta abordagem alternativa:

### 1. Verificar Configuração do Supabase

```bash
# Verificar se as variáveis de ambiente estão corretas
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 2. Testar Conexão com Supabase

```javascript
// No console do navegador (F12)
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("SUA_URL", "SUA_CHAVE");
const { data, error } = await supabase.auth.getSession();
console.log("Session:", data, error);
```

### 3. Verificar Logs do Supabase

1. No Supabase Dashboard, vá para **Logs**
2. Verifique se há erros relacionados ao OAuth
3. Procure por erros de "redirect_uri_mismatch"

## 🐛 Possíveis Causas

### 1. Configuração Incorreta no Google Cloud Console

- URLs de redirecionamento não configuradas corretamente
- Client ID ou Client Secret incorretos

### 2. Configuração Incorreta no Supabase

- URLs de redirecionamento não configuradas
- Google OAuth não ativado

### 3. Problema de CORS

- Domínio não autorizado no Google Cloud Console
- Problema de certificado SSL

### 4. Problema de Rede

- Firewall bloqueando requisições
- Proxy interferindo nas requisições

## 🔧 Soluções Alternativas

### Opção 1: Usar Login com Email/Senha

Se o Google OAuth continuar com problemas, use o login tradicional:

1. Crie um usuário admin via SQL
2. Use email/senha para login

### Opção 2: Configurar Outro Provedor OAuth

Configure outro provedor (GitHub, Discord, etc.) como alternativa

### Opção 3: Usar Supabase Auth UI

Implemente o componente oficial do Supabase para autenticação

## 📋 Checklist de Verificação

- [ ] Script SQL executado (password_hash permite NULL)
- [ ] Google OAuth ativo no Supabase
- [ ] URLs configuradas no Google Cloud Console
- [ ] URLs configuradas no Supabase
- [ ] Variáveis de ambiente corretas
- [ ] Teste de conexão com Supabase
- [ ] Verificação de logs do Supabase

## 🔍 Debug Avançado

### 1. Verificar Network Tab

1. Abra DevTools (F12)
2. Vá para Network tab
3. Tente fazer login com Google
4. Verifique as requisições que falham

### 2. Verificar Console

1. Abra DevTools (F12)
2. Vá para Console tab
3. Procure por erros relacionados ao OAuth

### 3. Verificar Application Tab

1. Abra DevTools (F12)
2. Vá para Application tab
3. Verifique se há tokens salvos

## 📞 Suporte

Se o problema persistir:

1. Verifique os logs do Supabase
2. Teste com outro navegador
3. Teste em modo incógnito
4. Verifique se há extensões interferindo
