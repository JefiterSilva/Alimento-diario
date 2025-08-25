# 📖 Alimento Diário - Devocionais Bíblicos

Uma aplicação moderna para compartilhar devocionais bíblicos com design responsivo e funcionalidades avançadas.

## ✨ Características

- 🎨 **Design Moderno**: Interface elegante com glassmorphism e animações suaves
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em mobile, tablet e desktop
- 🔍 **Busca Avançada**: Filtros por tags, autor e busca textual
- 🗄️ **Banco de Dados Supabase**: Armazenamento robusto e seguro
- 🔐 **Sistema de Autenticação**: Login seguro para administradores
- ⚡ **Performance Otimizada**: Next.js 15 com App Router
- 🎭 **Animações**: Framer Motion para transições fluidas

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/JefiterSilva/alimento-diario.git
cd alimento-diario
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta
```

### 4. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

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
└── lib/                  # Utilitários e configurações
    ├── supabase.ts       # Cliente Supabase
    ├── supabase-devotionals.ts # Funções de devocionais
    ├── supabase-auth.ts  # Funções de autenticação
    └── types.ts          # Tipos TypeScript
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar servidor de produção
npm run lint         # Verificar código
```

## 🚀 Deploy

O projeto está configurado para deploy automático no Vercel. Para mais detalhes, consulte:

- [Guia de Deploy](docs/DEPLOY_GUIDE.md)
- [Variáveis de Ambiente](docs/ENVIRONMENT_VARIABLES.md)
- [Próximos Passos](docs/NEXT_STEPS.md)

## 📚 Documentação

Toda a documentação de desenvolvimento está na pasta `docs/`:

- **Setup e Configuração**: `docs/DATABASE_SETUP.md`
- **Funcionalidades**: `docs/FUNCIONALIDADES_FINAIS.md`
- **Soluções de Problemas**: `docs/BUILD_FIX.md`
- **Correções**: Vários arquivos de correção na pasta `docs/`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para dúvidas ou problemas:

- Abra uma issue no GitHub
- Consulte a documentação em `docs/`
- Verifique os logs do Supabase

---

**Desenvolvido com ❤️ para compartilhar a Palavra de Deus**
