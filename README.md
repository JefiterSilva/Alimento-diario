# 📖 Palavra de Vida - Devocionais Diários

Uma aplicação moderna para compartilhar devocionais bíblicos com design responsivo e funcionalidades avançadas.

## ✨ Características

- 🎨 **Design Moderno**: Interface elegante com glassmorphism e animações suaves
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em mobile, tablet e desktop
- 🔍 **Busca Avançada**: Filtros por tags, autor e busca textual
- 🗄️ **Banco de Dados PostgreSQL**: Armazenamento robusto com Prisma ORM
- 🔐 **Sistema de Autenticação**: Login seguro para administradores
- ⚡ **Performance Otimizada**: Next.js 15 com App Router
- 🎭 **Animações**: Framer Motion para transições fluidas

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, Shadcn/ui
- **Database**: PostgreSQL com Prisma ORM
- **Authentication**: bcryptjs para hash de senhas
- **Icons**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (opcional, para PostgreSQL)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd alimento-diario
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

#### Opção A: Docker (Recomendado)

```bash
# Iniciar PostgreSQL
docker-compose up -d postgres

# Configurar banco
npm run db:push
npm run db:seed
```

#### Opção B: PostgreSQL Local

```bash
# Instalar PostgreSQL e criar banco
# Ver DATABASE_SETUP.md para instruções detalhadas

npm run db:push
npm run db:seed
```

### 4. Configure as variáveis de ambiente

```bash
# O arquivo .env já está configurado com valores padrão
# Para produção, altere as senhas e secrets
```

### 5. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🗄️ Banco de Dados

### Estrutura

- **Users**: Administradores e usuários
- **Devotionals**: Devocionais publicados
- **Tags**: Categorias dos devocionais
- **DevotionalTags**: Relacionamento many-to-many

### Comandos Úteis

```bash
# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema
npm run db:push

# Criar migração
npm run db:migrate

# Popular dados
npm run db:seed

# Interface visual
npm run db:studio
```

## 🔐 Credenciais de Acesso

- **Email**: `admin@devocionais.com`
- **Senha**: `admin123`
- **URL Admin**: `http://localhost:3000/admin`

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── admin/             # Área administrativa
│   ├── devocionais/       # Lista de devocionais
│   ├── devocional/        # Página individual
│   └── login/             # Página de login
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Shadcn/ui)
│   ├── header.tsx        # Navegação principal
│   └── devotional-card.tsx # Card de devocional
├── lib/                  # Utilitários e configurações
│   ├── prisma.ts         # Cliente Prisma
│   ├── db-devotionals.ts # Funções de devocionais
│   ├── db-auth.ts        # Funções de autenticação
│   └── types.ts          # Tipos TypeScript
└── prisma/               # Schema e configuração do banco
    ├── schema.prisma     # Schema do banco
    └── seed.ts           # Dados iniciais
```

## 🎨 Design System

### Cores Principais

- **Azul**: `#3B82F6` (Primary)
- **Índigo**: `#6366F1` (Secondary)
- **Slate**: `#64748B` (Text)

### Gradientes

- **Primary**: `from-blue-600 via-indigo-600 to-purple-600`
- **Success**: `from-emerald-500 via-teal-500 to-cyan-500`
- **Warning**: `from-orange-500 via-amber-500 to-yellow-500`

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar servidor de produção
npm run lint         # Verificar código

# Banco de Dados
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Sincronizar schema
npm run db:migrate   # Criar migração
npm run db:seed      # Popular dados
npm run db:studio    # Interface visual do banco
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas

- **Netlify**: Compatível com Next.js
- **Railway**: Suporte nativo ao PostgreSQL
- **DigitalOcean**: App Platform

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:

- Abra uma issue no GitHub
- Consulte a documentação em `DATABASE_SETUP.md`
- Verifique os logs do banco de dados

---

**Desenvolvido com ❤️ para compartilhar a Palavra de Deus**
