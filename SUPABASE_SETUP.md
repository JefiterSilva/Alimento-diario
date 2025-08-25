# 🚀 Configuração do Supabase

## 📋 **Visão Geral**

Este guia irá ajudá-lo a configurar o Supabase como banco de dados para a aplicação de devocionais.

## 🛠️ **Passo a Passo**

### **1. Criar Conta no Supabase**

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou crie uma conta
4. Clique em "New Project"

### **2. Configurar Projeto**

1. **Nome do Projeto:** `alimento-diario` (ou outro nome de sua preferência)
2. **Database Password:** Crie uma senha forte (guarde-a!)
3. **Region:** Escolha a região mais próxima (ex: São Paulo)
4. Clique em "Create new project"

### **3. Obter Credenciais**

Após a criação do projeto:

1. Vá para **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://your-project.supabase.co`)
   - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### **4. Configurar Variáveis de Ambiente**

Adicione as seguintes variáveis ao arquivo `.env`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **5. Criar Tabelas no Supabase**

Execute os seguintes comandos SQL no **SQL Editor** do Supabase:

#### **Tabela de Usuários**

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### **Tabela de Tags**

```sql
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Tabela de Devocionais**

```sql
CREATE TABLE devotionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  bible_verse TEXT NOT NULL,
  bible_reference VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_devotionals_updated_at BEFORE UPDATE ON devotionals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### **Tabela de Relacionamento Devocional-Tags**

```sql
CREATE TABLE devotional_tags (
  devotional_id UUID REFERENCES devotionals(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (devotional_id, tag_id)
);
```

### **6. Configurar Políticas de Segurança (RLS)**

#### **Política para Usuários**

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Política: Apenas admins podem inserir/atualizar/deletar
CREATE POLICY "Only admins can manage users" ON users
  FOR ALL USING (role = 'ADMIN');
```

#### **Política para Tags**

```sql
-- Habilitar RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler tags
CREATE POLICY "Anyone can read tags" ON tags
  FOR SELECT USING (true);

-- Política: Apenas admins podem gerenciar tags
CREATE POLICY "Only admins can manage tags" ON tags
  FOR ALL USING (true); -- Temporariamente permitir tudo
```

#### **Política para Devocionais**

```sql
-- Habilitar RLS
ALTER TABLE devotionals ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler devocionais publicados
CREATE POLICY "Anyone can read published devotionals" ON devotionals
  FOR SELECT USING (published = true);

-- Política: Apenas admins podem gerenciar devocionais
CREATE POLICY "Only admins can manage devotionals" ON devotionals
  FOR ALL USING (true); -- Temporariamente permitir tudo
```

#### **Política para Devotional-Tags**

```sql
-- Habilitar RLS
ALTER TABLE devotional_tags ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler relacionamentos
CREATE POLICY "Anyone can read devotional_tags" ON devotional_tags
  FOR SELECT USING (true);

-- Política: Apenas admins podem gerenciar relacionamentos
CREATE POLICY "Only admins can manage devotional_tags" ON devotional_tags
  FOR ALL USING (true); -- Temporariamente permitir tudo
```

### **7. Executar Seed dos Dados**

Execute o comando para popular o banco com dados iniciais:

```bash
npx tsx src/lib/supabase-seed.ts
```

### **8. Testar a Aplicação**

1. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

2. Acesse `http://localhost:3000`

3. Teste o login com as credenciais:
   - **Email:** `admin@devocionais.com`
   - **Senha:** `admin123`

## 🔧 **Troubleshooting**

### **Erro de Conexão**

- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se as tabelas foram criadas corretamente

### **Erro de Autenticação**

- Verifique se as políticas RLS estão configuradas
- Confirme se o usuário admin foi criado no seed

### **Erro de Tipos**

- Execute `npm run build` para verificar erros de TypeScript
- Verifique se os tipos no `supabase.ts` estão corretos

## 📊 **Monitoramento**

### **Dashboard do Supabase**

- Acesse o dashboard do seu projeto
- Monitore logs, performance e uso
- Configure backups automáticos

### **Logs da Aplicação**

- Verifique os logs no console do navegador
- Monitore as requisições nas ferramentas de desenvolvedor

## 🚀 **Próximos Passos**

1. **Configurar Autenticação Avançada**

   - Implementar login social (Google, GitHub)
   - Adicionar recuperação de senha

2. **Otimizações**

   - Implementar cache
   - Otimizar queries
   - Adicionar índices

3. **Funcionalidades Avançadas**
   - Upload de imagens
   - Sistema de comentários
   - Notificações

## 📞 **Suporte**

- **Documentação Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Comunidade:** [github.com/supabase/supabase](https://github.com/supabase/supabase)
- **Discord:** [discord.supabase.com](https://discord.supabase.com)
