# 🔧 Variáveis de Ambiente

Este documento descreve as variáveis de ambiente necessárias para executar o projeto Alimento Diário.

## 📋 Variáveis Obrigatórias

### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Next.js Configuration
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```

## 🔐 Variáveis Opcionais

### Google OAuth (para login social)
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Database Configuration (se usar PostgreSQL direto)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/alimento_diario
```

## 🚀 Configuração para Deploy

### Vercel
1. Acesse o dashboard do Vercel
2. Vá para Settings > Environment Variables
3. Adicione cada variável listada acima
4. Configure os valores de produção

### Outras Plataformas
- **Netlify**: Configure em Site Settings > Environment Variables
- **Railway**: Configure em Variables tab
- **DigitalOcean**: Configure em App Spec

## 🔍 Como Obter as Variáveis

### Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá para Settings > API
4. Copie as URLs e chaves

### Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto
3. Configure OAuth 2.0
4. Obtenha Client ID e Secret

### NextAuth Secret
```bash
# Gere uma chave secreta
openssl rand -base64 32
```

## ⚠️ Segurança

- **NUNCA** commite arquivos `.env` no Git
- Use variáveis de ambiente diferentes para desenvolvimento e produção
- Rotacione as chaves regularmente
- Use secrets management em produção

## 📝 Exemplo de .env.local

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
