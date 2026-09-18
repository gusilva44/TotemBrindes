# 🎁 Totem de Brindes

O **Totem de Brindes** é uma solução *full-stack* desenvolvida para a gestão e automação do processo de resgate e distribuição de brindes em totens interativos. O projeto contempla uma API RESTful completa com autenticação segura, persistência em banco de dados, documentação via Swagger, além de uma interface frontend otimizada para interação do usuário final.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com **Express**
- **Autenticação**: JSON Web Token (JWT)
- **Segurança & Validação**: Middlewares customizados para validação de requisições e segurança
- **Banco de Dados**: Relacional (scripts de inicialização SQL incluídos)
- **Documentação de API**: Swagger UI / OpenAPI

### Frontend
- **Node.js / React**
- Servido na porta `3001`
- Recursos multimídia para exibição no totem

### Infraestrutura & DevOps
- **Docker** e **Dockerfile** (para Backend e Frontend)
- **Docker Compose** para orquestração simplificada dos serviços

---

## 📁 Estrutura do Projeto

```text
TotemBrindes/
├── docker-compose.yml          # Arquivo de orquestração dos contêineres
├── .github/
│   └── workflows/              # CI: build e publicação das imagens
├── backend/                    # API Backend
│   ├── Dockerfile              # Dockerfile do Backend
│   ├── .env.example            # Modelo das variáveis de ambiente
│   ├── .sql                    # Script de criação do schema e seed
│   ├── package.json            # Dependências do Backend
│   └── src/
│       ├── auth/               # Serviços de autenticação e geração de JWT
│       ├── controllers/        # Controladores (Autenticação, Pedidos, Produtos)
│       ├── docs/               # Configuração do Swagger e schemas das rotas
│       ├── middlewares/        # Middlewares de validação, segurança e auth
│       ├── repository/         # Conexão e queries ao Banco de Dados (db.js)
│       ├── routers/            # Definição das rotas do sistema
│       ├── services/           # Regras de negócio (ex: Pedidos)
│       ├── utils/              # Funções utilitárias (formatação de datas, logs)
│       └── server.js           # Ponto de entrada do servidor backend
└── frontend/                   # Interface Frontend
    ├── Dockerfile              # Dockerfile do Frontend (build + nginx)
    ├── nginx.conf              # Configuração do nginx que serve o build
    ├── .env.example            # Modelo das variáveis de ambiente
    ├── package.json            # Dependências do Frontend
    ├── public/                 # Arquivos estáticos e imagens
    └── src/                    # Componentes, páginas e estilos
```

---

## ⚙️ Funcionalidades Principais

1. **Autenticação de Usuários / Operadores**:
   - Login seguro com geração e validação de tokens JWT.
2. **Gestão de Produtos e Brindes**:
   - Listagem, atualização de estoque e controle de brindes disponíveis no totem.
3. **Processamento de Pedidos e Resgates**:
   - Registro de solicitações e validação de elegibilidade para recebimento do brinde.
4. **Documentação Interativa da API**:
   - Rotas documentadas em tempo real com Swagger.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

---

### Opção 1: Executando via Docker Compose (Recomendado)

A forma mais rápida de subir o ambiente completo (Backend + Frontend + Banco de dados):

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/TotemBrindes.git
   cd TotemBrindes-main
   ```

2. **Inicie os serviços com o Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Acesse as aplicações:**
   - **Frontend:** `http://localhost:3001`
   - **Backend API:** `http://localhost:3000` (ou porta configurada)
   - **Documentação Swagger:** `http://localhost:3000/docs`

---

### Opção 2: Executando Localmente (Desenvolvimento)

#### 1. Configurando e Executando o Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` a partir do modelo e preencha os valores:
   ```bash
   cp .env.example .env
   ```
   ```env
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   DB_DATABASE=totembrindes

   JWT_SECRET=sua_chave_secreta_aqui
   JWT_EXPIRES_IN_SECONDS=1800

   ADMIN_API_KEY=chave_de_acesso_ao_painel_admin

   CORS_ORIGIN=http://localhost:3001
   ```
   Com `NODE_ENV=production` a aplicação não sobe sem `JWT_SECRET` definido.
4. Execute o script SQL no seu banco de dados a partir do arquivo `backend/.sql`.
5. Inicie o servidor:
   ```bash
   npm start
   ```

#### 2. Configurando e Executando o Frontend

1. Em outro terminal, navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` a partir do modelo:
   ```bash
   cp .env.example .env
   ```
   ```env
   PORT=3001
   REACT_APP_API_URL=http://localhost:3000
   ```
   `REACT_APP_API_URL` só é usada em desenvolvimento. Em produção a aplicação usa o caminho relativo `/api`, resolvido pelo proxy reverso.
4. Inicie a aplicação frontend:
   ```bash
   npm start
   ```

---

## 📚 Documentação da API (Swagger)

Com o backend rodando, acesse a interface do Swagger para visualizar todas as rotas disponíveis, payloads necessários e testar as requisições diretamente pelo navegador:

```text
http://localhost:3000/docs
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Para mais detalhes, consulte o arquivo `LICENSE` caso disponível.
