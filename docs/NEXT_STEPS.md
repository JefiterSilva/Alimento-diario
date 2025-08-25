# 🎯 Próximos Passos - Deploy GitHub + Vercel

## ✅ O que já foi feito

- ✅ Repositório Git inicializado
- ✅ Arquivo `.gitignore` configurado
- ✅ Primeiro commit realizado
- ✅ Documentação de variáveis de ambiente criada
- ✅ Guia completo de deploy criado
- ✅ Arquivo `vercel.json` já configurado

## 🚀 Próximos Passos (Manual)

### 1. Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `alimento-diario`
4. Descrição: `Aplicação de devocionais bíblicos com Next.js e Supabase`
5. Deixe público ou privado (sua escolha)
6. **NÃO** marque "Add README" ou "Add .gitignore"
7. Clique em "Create repository"

### 2. Conectar ao GitHub

Execute estes comandos no terminal (substitua `SEU_USUARIO` pelo seu username):

```bash
git remote add origin https://github.com/SEU_USUARIO/alimento-diario.git
git branch -M main
git push -u origin main
```

### 3. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute os scripts SQL:
   - `create-tables.sql`
   - `create-admin-user.sql`
   - `add-author-id-to-devotionals.sql`
4. Copie as credenciais (URL e chaves)

### 4. Fazer Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub
3. Importe o repositório `alimento-diario`
4. Configure as variáveis de ambiente:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
   NEXTAUTH_URL=https://seu-dominio.vercel.app
   NEXTAUTH_SECRET=sua_chave_secreta
   ```
5. Clique em "Deploy"

## 📋 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o GitHub
- [ ] Projeto Supabase criado
- [ ] Scripts SQL executados
- [ ] Credenciais do Supabase copiadas
- [ ] Projeto Vercel criado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Aplicação testada online

## 🔗 Links Úteis

- **GitHub**: https://github.com
- **Vercel**: https://vercel.com
- **Supabase**: https://supabase.com
- **Guia Completo**: `DEPLOY_GUIDE.md`
- **Variáveis de Ambiente**: `ENVIRONMENT_VARIABLES.md`

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Consulte o `DEPLOY_GUIDE.md` para instruções detalhadas
2. Verifique se todas as variáveis de ambiente estão configuradas
3. Teste localmente primeiro com `npm run build`
4. Verifique os logs no Vercel Dashboard

## 🎉 Sucesso!

Após completar todos os passos, sua aplicação estará disponível em:
`https://alimento-diario.vercel.app` (ou URL personalizada)

---

**Boa sorte com o deploy! 🚀**
