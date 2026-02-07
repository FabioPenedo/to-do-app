# To-Do App

Uma aplicação frontend simples para gerenciamento de tarefas, construída com Vite, React, TypeScript e Material UI.

## Características

- ✅ **CRUD de Tarefas**: Criar, listar, editar e deletar tarefas
- 📁 **Categorização**: Organize tarefas por categorias (Trabalho, Estudo, Pessoal)
- ✓ **Marcar Concluído**: Marque tarefas como concluídas
- 🎨 **Interface Material UI**: Design limpo e responsivo
- 💾 **Estado Local**: Sem backend, sem persistência

## Estrutura do Projeto

```
src/
├── App.tsx           # Componente principal com CRUD e estado
├── main.tsx          # Entrada da aplicação com ThemeProvider do MUI
```

## Funcionalidades

### Tarefa (Task)
```typescript
interface Task {
  id: string;
  title: string;           // Obrigatório
  description?: string;    // Opcional
  category: string;        // Obrigatório (Trabalho, Estudo, Pessoal)
  completed: boolean;      // Status de conclusão
}
```

### Operações
- **Criar**: Clique em "Nova Tarefa" para abrir o formulário
- **Editar**: Clique no ícone de edição para modificar uma tarefa
- **Deletar**: Clique no ícone de lixeira para remover uma tarefa
- **Concluir**: Clique na checkbox para marcar como concluída

## Validações

- **Título**: Obrigatório (não pode estar vazio)
- **Categoria**: Obrigatória (deve selecionar uma das opções)

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra o navegador e acesse `http://localhost:5173`

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o eslint para verificar o código

## Dependências

- **React 18.2**: Biblioteca UI
- **Material UI 5.14**: Componentes e estilo
- **TypeScript**: Tipagem estática
- **Vite 5**: Ferramenta de build

## Notas

- Esta é uma aplicação prototype sem persistência em banco de dados
- O estado é mantido apenas na memória (useState)
- Ideal para prototipar e validar funcionalidades rápidamente
