# 🚀 Guia de Deploy - GitHub + Vercel

Este guia completo irá ajudá-lo a fazer o deploy do projeto Alimento Diário no GitHub e Vercel.

## 📋 Pré-requisitos

- Conta no [GitHub](https://github.com)
- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com) (para banco de dados)
- Git instalado no seu computador

## 🔄 Passo 1: Criar Repositório no GitHub

### Opção A: Via GitHub Web Interface (Recomendado)

1. **Acesse [github.com](https://github.com)** e faça login
2. **Clique no botão "+"** no canto superior direito
3. **Selecione "New repository"**
4. **Configure o repositório:**
   - **Repository name**: `alimento-diario`
   - **Description**: `Aplicação de devocionais bíblicos com Next.js e Supabase`
   - **Visibility**: Public ou Private (sua escolha)
   - **NÃO** marque "Add a README file" (já temos um)
   - **NÃO** marque "Add .gitignore" (já temos um)
5. **Clique em "Create repository"**

### Opção B: Via GitHub CLI

```bash
# Instalar GitHub CLI (se não tiver)
# Windows: https://cli.github.com/

# Fazer login
gh auth login

# Criar repositório
gh repo create alimento-diario --public --description "Aplicação de devocionais bíblicos com Next.js e Supabase"
```

## 🔗 Passo 2: Conectar Repositório Local ao GitHub

```bash
# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/alimento-diario.git

# Verificar se foi adicionado corretamente
git remote -v

# Fazer push do código
git branch -M main
git push -u origin main
```

## 🗄️ Passo 3: Configurar Supabase

1. **Acesse [supabase.com](https://supabase.com)** e faça login
2. **Crie um novo projeto:**
   - Clique em "New Project"
   - Escolha sua organização
   - Digite um nome: `alimento-diario`
   - Escolha uma senha forte para o banco
   - Selecione uma região próxima
   - Clique em "Create new project"

3. **Aguarde a criação** (pode levar alguns minutos)

4. **Configure o banco de dados:**
   - Vá para SQL Editor
   - Execute os scripts SQL do projeto:
     - `create-tables.sql`
     - `create-admin-user.sql`
     - `add-author-id-to-devotionals.sql`

5. **Obtenha as credenciais:**
   - Vá para Settings > API
   - Copie:
     - **Project URL**
     - **anon public key**
     - **service_role key** (mantenha segura!)

## ⚙️ Passo 4: Configurar Vercel

1. **Acesse [vercel.com](https://vercel.com)** e faça login
2. **Conecte sua conta GitHub** (se ainda não estiver conectada)
3. **Clique em "New Project"**
4. **Importe o repositório:**
   - Selecione o repositório `alimento-diario`
   - Clique em "Import"

5. **Configure o projeto:**
   - **Project Name**: `alimento-diario` (ou deixe o padrão)
   - **Framework Preset**: Next.js (deve ser detectado automaticamente)
   - **Root Directory**: `./` (deixe vazio)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)
   - **Install Command**: `npm install` (padrão)

6. **Configure as variáveis de ambiente:**
   - Clique em "Environment Variables"
   - Adicione cada variável:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
   NEXTAUTH_URL=https://seu-dominio.vercel.app
   NEXTAUTH_SECRET=sua_chave_secreta_nextauth
   ```

7. **Clique em "Deploy"**

## 🔧 Passo 5: Configurações Adicionais

### Configurar Domínio Personalizado (Opcional)

1. **No Vercel Dashboard:**
   - Vá para Settings > Domains
   - Adicione seu domínio personalizado
   - Configure os registros DNS conforme instruído

### Configurar Google OAuth (Opcional)

1. **No Google Cloud Console:**
   - Crie um projeto
   - Configure OAuth 2.0
   - Adicione os URIs de redirecionamento:
     - `https://seu-dominio.vercel.app/api/auth/callback/google`

2. **No Vercel:**
   - Adicione as variáveis:
     ```env
     GOOGLE_CLIENT_ID=seu_google_client_id
     GOOGLE_CLIENT_SECRET=seu_google_client_secret
     ```

## ✅ Passo 6: Verificar o Deploy

1. **Aguarde o build** (geralmente 2-5 minutos)
2. **Teste a aplicação:**
   - Acesse o URL fornecido pelo Vercel
   - Teste as funcionalidades principais
   - Verifique se o login funciona
   - Teste a criação de devocionais

## 🔄 Passo 7: Deploy Automático

A partir de agora, cada vez que você fizer push para a branch `main` no GitHub, o Vercel fará o deploy automaticamente.

```bash
# Para fazer atualizações
git add .
git commit -m "Sua mensagem de commit"
git push origin main
```

## 🛠️ Solução de Problemas

### Erro de Build
- Verifique os logs no Vercel Dashboard
- Confirme se todas as variáveis de ambiente estão configuradas
- Teste localmente com `npm run build`

### Erro de Banco de Dados
- Verifique se o Supabase está funcionando
- Confirme se as tabelas foram criadas corretamente
- Verifique as permissões do banco

### Erro de Autenticação
- Confirme se as chaves do Supabase estão corretas
- Verifique se o NEXTAUTH_URL está configurado corretamente
- Teste o login localmente primeiro

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** no Vercel Dashboard
2. **Consulte a documentação** do projeto
3. **Abra uma issue** no GitHub
4. **Verifique o status** do Supabase

## 🎉 Próximos Passos

- Configure um domínio personalizado
- Configure monitoramento e analytics
- Configure backups automáticos do banco
- Configure CI/CD para testes automatizados

---

**🎊 Parabéns! Sua aplicação está no ar!**
