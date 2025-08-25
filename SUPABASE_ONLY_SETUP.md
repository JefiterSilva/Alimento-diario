# 🚀 Configuração Supabase Only

## 📋 Visão Geral

Esta aplicação agora usa **apenas** o Supabase como banco de dados, sem dependências locais ou dados mock.

## ✅ Configuração Atual

### Variáveis de Ambiente (`.env`)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jkflvxyitauobqygcujh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Arquivos Removidos

- ❌ `prisma/` - Pasta completa do Prisma
- ❌ `src/lib/prisma.ts` - Cliente Prisma
- ❌ `src/lib/mock-data.ts` - Dados mock
- ❌ `src/lib/mock-data-enhanced.ts` - Dados mock aprimorados
- ❌ `src/lib/mock-auth.ts` - Autenticação mock
- ❌ `prisma-seed.ts` - Seed do Prisma
- ❌ `PRISMA_SUPABASE_SETUP.md` - Documentação do Prisma

### Arquivos Mantidos

- ✅ `src/lib/supabase.ts` - Cliente Supabase
- ✅ `src/lib/supabase-devotionals.ts` - Funções de devocionais
- ✅ `src/lib/supabase-auth.ts` - Autenticação
- ✅ `src/lib/supabase-seed.ts` - Seed do Supabase
- ✅ `src/lib/database-config.ts` - Configuração simplificada

## 🛠️ Comandos Disponíveis

### Desenvolvimento

```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar servidor de produção
```

### Supabase

```bash
npm run supabase:seed  # Executar seed dos dados
```

## 📊 Estrutura do Banco

O Supabase contém as seguintes tabelas:

- **users**: Usuários do sistema
- **devotionals**: Devocionais
- **tags**: Tags para categorização
- **devotional_tags**: Relacionamento many-to-many

## 🔑 Credenciais de Acesso

- **Email**: `admin@devocionais.com`
- **Senha**: `admin123`

## 🚨 Troubleshooting

### Erro: "Supabase não está configurado"

1. Verifique se o arquivo `.env` existe
2. Confirme se as variáveis estão corretas
3. Reinicie o servidor de desenvolvimento

### Erro: "Invalid API key"

1. Acesse o dashboard do Supabase
2. Vá em Settings → API
3. Copie a chave anônima correta
4. Atualize o arquivo `.env`

### Erro: "Table does not exist"

1. Execute o seed: `npm run supabase:seed`
2. Verifique se as tabelas foram criadas no Supabase

## 🎯 Vantagens da Configuração

- ✅ **Simplicidade**: Apenas um banco de dados
- ✅ **Performance**: Sem overhead de múltiplas configurações
- ✅ **Manutenção**: Menos arquivos para manter
- ✅ **Deploy**: Configuração mais simples para produção
- ✅ **Escalabilidade**: Supabase gerencia a infraestrutura

## 📚 Próximos Passos

1. ✅ Configuração concluída
2. ✅ Dados populados no Supabase
3. ✅ Aplicação funcionando
4. 🔄 Testar funcionalidades
5. 🔄 Configurar políticas RLS se necessário
6. 🔄 Deploy para produção
