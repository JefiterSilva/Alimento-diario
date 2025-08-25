# Solução para o Erro de JSON

## Problema
O erro `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` indica que a aplicação está recebendo HTML (página de erro) em vez de dados JSON válidos.

## Causa
O problema ocorre porque as variáveis de ambiente do Supabase não estão configuradas. Quando isso acontece:

1. As chamadas de API falham
2. O servidor retorna páginas de erro HTML em vez de JSON
3. O cliente tenta fazer `JSON.parse()` no HTML, causando o erro

## Solução

### 1. Configurar as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Obter as Credenciais do Supabase

1. Acesse https://supabase.com
2. Faça login na sua conta
3. Clique no seu projeto (ou crie um novo)
4. Vá em Settings → API
5. Copie o "Project URL" e "anon public" key

### 3. Usar o Script de Configuração

Execute o script de configuração automática:

```bash
node setup-env.js
```

Este script irá:
- Solicitar as credenciais do Supabase
- Criar automaticamente o arquivo `.env.local`
- Configurar as variáveis de ambiente

### 4. Reiniciar o Servidor

Após configurar as variáveis de ambiente:

```bash
npm run dev
```

## Verificação

Para verificar se a configuração está correta:

1. Abra o console do navegador (F12)
2. Recarregue a página
3. Verifique se não há mais erros de JSON
4. As chamadas de API devem retornar dados válidos

## Correções Implementadas

1. **Melhor tratamento de erro no api-client.ts**: Adicionado verificação de content-type e melhor logging de erros
2. **Correção da página inicial**: Alterado para usar a API em vez de chamadas diretas ao Supabase
3. **Criação da rota de usuários**: Adicionada rota `/api/users/[id]` que estava faltando

## Estrutura de Arquivos

```
src/
├── app/
│   └── api/
│       ├── users/
│       │   └── [id]/
│       │       └── route.ts  # Nova rota para usuários
│       ├── devotionals/
│       └── tags/
├── lib/
│   ├── api-client.ts         # Melhorado com tratamento de erro
│   └── auth-context.tsx      # Usa API em vez de Supabase direto
```

## Próximos Passos

Após resolver o erro de JSON:

1. Teste todas as funcionalidades da aplicação
2. Verifique se o login está funcionando
3. Teste a criação e edição de devocionais
4. Verifique se as tags estão sendo carregadas corretamente
