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
TotemBrindes-main/
├── docker-compose.yml          # Arquivo de orquestração dos contêineres
├── backend/                    # API Backend
│   ├── Dockerfile              # Dockerfile do Backend
│   ├── .env                    # Variáveis de ambiente (Backend)
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
    ├── Dockerfile              # Dockerfile do Frontend
    ├── .env                    # Variáveis de ambiente (PORT=3001)
    ├── package.json            # Dependências do Frontend
    └── public/                 # Arquivos estáticos e imagens do totem
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
   - **Documentação Swagger:** `http://localhost:3000/api-docs` (ou rota correspondente)

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
3. Configure as variáveis de ambiente criando/editando o arquivo `.env`:
   ```env
   PORT=3000
   JWT_SECRET=sua_chave_secreta_aqui
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=totembrindes
   ```
4. Execute os scripts SQL no seu banco de dados a partir dos arquivos presentes em `backend/src/.sql`.
5. Inicie o servidor:
   ```bash
   npm start
   # ou para modo desenvolvimento:
   npm run dev
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
3. Verifique o arquivo `.env` para garantir a porta desejada:
   ```env
   PORT=3001
   ```
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
