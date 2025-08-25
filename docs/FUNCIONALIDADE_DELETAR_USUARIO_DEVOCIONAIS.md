# Funcionalidade: Deletar Usuário com Devocionais

## 🎯 **Objetivo**

Implementar uma funcionalidade que permite deletar usuários automaticamente junto com todos os seus devocionais, com um modal de confirmação robusto e seguro.

## ✅ **Funcionalidades Implementadas**

### **1. CASCADE DELETE no Banco de Dados**

- ✅ Constraint alterada para `ON DELETE CASCADE`
- ✅ Deleta automaticamente devocionais quando usuário é deletado
- ✅ Mantém integridade referencial do banco

### **2. Função de Deletar Melhorada**

- ✅ Verifica quantos devocionais o usuário tem
- ✅ Retorna informações sobre devocionais deletados
- ✅ Tratamento de erros robusto
- ✅ Logs detalhados para debug

### **3. Modal de Confirmação Avançado**

- ✅ Alerta visual sobre ação irreversível
- ✅ Mostra quantos devocionais serão deletados
- ✅ Lista detalhada do que acontecerá
- ✅ Checkbox de confirmação obrigatória
- ✅ Botão desabilitado até confirmação

## 🛠️ **Como Usar**

### **Passo 1: Configurar Banco de Dados**

Execute o script `delete-user-with-devotionals.sql` no Supabase:

```sql
-- Alterar constraint para CASCADE DELETE
ALTER TABLE devotionals
DROP CONSTRAINT IF EXISTS devotionals_author_id_fkey;

ALTER TABLE devotionals
ADD CONSTRAINT devotionals_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES users(id)
ON DELETE CASCADE;
```

### **Passo 2: Usar a Interface**

1. **Acesse** `/admin/usuarios`
2. **Clique** no botão "Deletar" de um usuário
3. **Verifique** as informações no modal:
   - Nome do usuário
   - Quantos devocionais serão deletados
   - Lista de consequências
4. **Marque** o checkbox de confirmação
5. **Clique** em "Confirmar Exclusão"

## 🔍 **Características do Modal**

### **Alertas Visuais**

- **Vermelho**: Aviso sobre ação irreversível
- **Amarelo**: Lista detalhada do que acontecerá
- **Ícones**: Indicadores visuais claros

### **Informações Mostradas**

- Nome do usuário a ser deletado
- Quantidade de devocionais (se houver)
- Lista de consequências da ação
- Aviso de irreversibilidade

### **Segurança**

- Checkbox obrigatório para confirmação
- Botão desabilitado até confirmação
- Múltiplos avisos visuais
- Confirmação explícita

## 📋 **Fluxo de Funcionamento**

1. **Clique em "Deletar"**

   - Verifica quantos devocionais o usuário tem
   - Abre modal com informações

2. **Modal de Confirmação**

   - Mostra alertas visuais
   - Lista consequências
   - Requer checkbox de confirmação

3. **Confirmação**

   - Deleta usuário do banco
   - Devocionais são deletados automaticamente (CASCADE)
   - Atualiza interface
   - Mostra mensagem de sucesso

4. **Resultado**
   - Usuário removido permanentemente
   - Devocionais deletados automaticamente
   - Interface atualizada

## 🚨 **Cenários de Uso**

### **Usuário sem Devocionais**

- ✅ Deletar normalmente
- ✅ Modal mostra "0 devocionais"
- ✅ Confirmação simples

### **Usuário com Devocionais**

- ✅ Modal mostra quantidade de devocionais
- ✅ Aviso sobre perda de dados
- ✅ Confirmação obrigatória

### **Último Admin**

- ✅ Verificação de permissões
- ✅ Aviso sobre último admin
- ✅ Proteção contra exclusão acidental

## 🔧 **Configurações Técnicas**

### **Banco de Dados**

```sql
-- Constraint configurada
FOREIGN KEY (author_id)
REFERENCES users(id)
ON DELETE CASCADE
```

### **Função de Deletar**

```typescript
deleteUser(id: string): Promise<{
  success: boolean;
  error?: string;
  devotionalsCount?: number;
}>
```

### **Modal de Confirmação**

- Componente Dialog do Shadcn UI
- Estados para usuário e contagem de devocionais
- Validação de checkbox obrigatório

## 📞 **Próximos Passos**

1. **Execute o script SQL** para configurar CASCADE DELETE
2. **Teste a funcionalidade** com diferentes cenários
3. **Verifique os logs** para debug se necessário
4. **Configure permissões** adequadas se necessário

## 🔍 **Logs e Debug**

- **Console do navegador**: Logs de verificação e exclusão
- **Supabase logs**: Erros de banco de dados
- **Interface**: Feedback visual em tempo real
- **Modal**: Informações detalhadas sobre a ação

## ⚠️ **Importante**

- **Esta ação é irreversível**
- **Todos os dados do usuário serão perdidos**
- **Devocionais serão deletados automaticamente**
- **Confirme cuidadosamente antes de prosseguir**
