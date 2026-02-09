# To-Do App Frontend

Uma aplicação frontend completa para gerenciamento de tarefas, construída com Vite, React, TypeScript e Material UI, integrada com backend via API REST.

## ✨ Características

- 🔐 **Autenticação**: Sistema completo de login e registro
- ✅ **CRUD de Tarefas**: Criar, listar, editar e deletar tarefas
- 📁 **Categorização**: Organize tarefas por categorias (Trabalho, Estudo, Pessoal)
- ✓ **Marcar Concluído**: Marque tarefas como concluídas
- 🎨 **Interface Material UI**: Design limpo e responsivo
- 🔒 **Rotas Privadas**: Proteção de rotas com autenticação
- 🌐 **Integração API**: Comunicação com backend via HTTP client
- 🐳 **Docker**: Suporte para containerização

## 📂 Estrutura do Projeto

```
src/
├── App.tsx                      # Componente principal e configuração de rotas
├── main.tsx                     # Entrada da aplicação
├── components/
│   ├── Header.tsx               # Componente de cabeçalho
│   ├── Home.tsx                 # Página inicial
│   ├── Login.tsx                # Tela de login
│   ├── Register.tsx             # Tela de registro
│   ├── PrivateRoute.tsx         # HOC para rotas protegidas
│   └── TaskApp.tsx              # Aplicação de tarefas
├── hooks/
│   └── useAuth.ts               # Hook customizado de autenticação
├── lib/
│   ├── api-error.ts             # Tratamento de erros da API
│   ├── http-client.ts           # Cliente HTTP configurado
│   ├── info.store.ts            # Gerenciamento de estado
│   └── services/
│       ├── auth.service.ts      # Serviço de autenticação
│       └── task.service.ts      # Serviço de tarefas
```

## 🚀 Funcionalidades

### Autenticação
- **Registro**: Criar nova conta de usuário
- **Login**: Autenticar com credenciais
- **Logout**: Encerrar sessão
- **Proteção de Rotas**: Acesso restrito a áreas autenticadas

### Gerenciamento de Tarefas
- **Criar**: Adicionar novas tarefas
- **Listar**: Visualizar todas as tarefas
- **Editar**: Modificar tarefas existentes
- **Deletar**: Remover tarefas
- **Concluir**: Marcar/desmarcar como concluída


## 🛠️ Tecnologias

- **React 18.2** - Biblioteca UI
- **TypeScript 5.2** - Tipagem estática
- **Material UI 5.14** - Componentes e design system
- **React Router DOM 7.13** - Roteamento e navegação
- **Vite 5** - Build tool e dev server
- **Docker** - Containerização

## ⚙️ Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Desenvolvimento Local

1. Clone o repositório e navegue até a pasta:
```bash
cd To-do-front
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (se necessário):
```bash
# Crie um arquivo .env com a URL do backend
VITE_API_BASE_URL=http://localhost:8080/api
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra o navegador e acesse `http://localhost:5173`

### Usando Docker

1. Build da imagem:
```bash
docker build -t todo-front .
```

2. Execute o container:
```bash
docker-compose up
```

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com hot reload
- `npm run build` - Compila o projeto para produção (TypeScript + Vite)
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o ESLint para verificar o código

## 🏗️ Arquitetura

### HTTP Client
O projeto utiliza um cliente HTTP customizado (`http-client.ts`) para centralizar a comunicação com a API, incluindo:
- Configuração de headers
- Tratamento de autenticação
- Interceptadores de requisição e resposta

### Gerenciamento de Estado
- **Local State**: React hooks (useState, useEffect)
- **Custom Hooks**: `useAuth` para lógica de autenticação
- **Info Store**: Gerenciamento de informações globais

### Tratamento de Erros
Sistema centralizado de erros da API (`api-error.ts`) para feedback consistente ao usuário.

## 🔐 Autenticação

O sistema de autenticação utiliza:
- Token JWT armazenado localmente
- Rotas protegidas via `PrivateRoute`
- Serviço dedicado (`auth.service.ts`)
- Hook customizado para gerenciar estado de autenticação

## 📝 Notas

- Certifique-se de que o backend esteja rodando para funcionalidade completa
- As credenciais são gerenciadas via serviço de autenticação
- Todas as rotas de tarefas requerem autenticação

## 🤝 Back-end
GitHub: [@Backend](https://github.com/FabioPenedo/To-do-teste)

