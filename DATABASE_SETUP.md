# 🗄️ Configuração do Banco de Dados

Este projeto utiliza **PostgreSQL** com **Prisma ORM** para gerenciar os dados dos devocionais.

## 📋 Pré-requisitos

1. **PostgreSQL** instalado e rodando
2. **Node.js** e **npm** instalados
3. **Docker** (opcional, para rodar PostgreSQL em container)

## 🚀 Configuração Rápida

### Opção 1: Docker (Recomendado)

```bash
# 1. Iniciar PostgreSQL com Docker
docker run --name postgres-devotionals \
  -e POSTGRES_DB=devotionals \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=devotionals123 \
  -p 5432:5432 \
  -d postgres:15

# 2. Verificar se o container está rodando
docker ps

# 3. Configurar o banco de dados
npm run db:push

# 4. Popular com dados iniciais
npm run db:seed
```

### Opção 2: PostgreSQL Local

1. **Instalar PostgreSQL** em sua máquina
2. **Criar banco de dados**:
   ```sql
   CREATE DATABASE devotionals;
   CREATE USER admin WITH PASSWORD 'devotionals123';
   GRANT ALL PRIVILEGES ON DATABASE devotionals TO admin;
   ```
3. **Configurar o banco**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

## 🔧 Comandos Úteis

```bash
# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema com banco (desenvolvimento)
npm run db:push

# Criar migração (produção)
npm run db:migrate

# Popular banco com dados iniciais
npm run db:seed

# Abrir Prisma Studio (interface visual)
npm run db:studio
```

## 📊 Estrutura do Banco

### Tabelas Principais

- **`users`**: Usuários do sistema (admin/usuários)
- **`devotionals`**: Devocionais publicados
- **`tags`**: Categorias/tags dos devocionais
- **`devotional_tags`**: Relacionamento many-to-many

### Dados Iniciais

O script de seed cria:

- ✅ Usuário admin: `admin@devocionais.com` / `admin123`
- ✅ 10 tags com cores personalizadas
- ✅ 3 devocionais de exemplo

## 🔐 Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contenha:

```env
DATABASE_URL="postgresql://admin:devotionals123@localhost:5432/devotionals?schema=public"
JWT_SECRET="seu_jwt_secret_super_seguro_aqui_2024"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu_nextauth_secret_aqui_2024"
```

## 🛠️ Troubleshooting

### Erro de Conexão

```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Verificar logs do container
docker logs postgres-devotionals

# Testar conexão
psql -h localhost -U admin -d devotionals
```

### Reset do Banco

```bash
# Parar container
docker stop postgres-devotionals

# Remover container
docker rm postgres-devotionals

# Recriar container
docker run --name postgres-devotionals \
  -e POSTGRES_DB=devotionals \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=devotionals123 \
  -p 5432:5432 \
  -d postgres:15

# Reconfigurar
npm run db:push
npm run db:seed
```

## 📈 Próximos Passos

1. ✅ Configurar banco de dados
2. 🔄 Atualizar componentes para usar Prisma
3. 🔐 Implementar autenticação com banco
4. 🚀 Deploy em produção

## 🎯 Credenciais de Acesso

- **Email**: `admin@devocionais.com`
- **Senha**: `admin123`
- **URL Admin**: `http://localhost:3000/admin`
