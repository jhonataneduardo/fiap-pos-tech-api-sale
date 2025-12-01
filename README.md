# FIAP Pós-Tech API Read

API read-only para consulta de veículos - Tech Challenge | Software Architecture FIAP

## 📋 Descrição

Este serviço é responsável apenas por consultas (leitura) de dados de veículos. Ele compartilha o mesmo banco de dados da API principal (`fiap-pos-tech-api`) mas opera exclusivamente com operações GET, seguindo o princípio de segregação de responsabilidades.

## 🎯 Endpoints

Todos os endpoints requerem autenticação JWT (Bearer token obtido através do `fiap-pos-tech-auth`).

### Veículos

- **GET** `/api/v1/vehicles` - Lista todos os veículos
- **GET** `/api/v1/vehicles/available` - Lista veículos disponíveis (não vendidos)
- **GET** `/api/v1/vehicles/sold` - Lista veículos vendidos com informações de venda

### Documentação

- **GET** `/api-docs` - Swagger UI com documentação interativa
- **GET** `/api/v1/health` - Health check do serviço

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com **Domain-Driven Design (DDD)**:

```
src/
├── core/                           # Camada central
│   ├── domain/                     # Entidades base
│   ├── application/                # Erros de aplicação
│   └── infrastructure/             # Infraestrutura compartilhada
│       ├── database/               # Prisma client
│       ├── di/                     # Dependency Injection
│       ├── http/                   # HTTP utilities
│       └── swagger/                # API documentation
└── modules/
    └── vehicle_read/               # Módulo de leitura de veículos
        ├── domain/                 # Entidades e interfaces
        ├── application/            # Use cases, DTOs, controllers
        └── infrastructure/         # Repositórios, presenters, HTTP
```

### Camadas

- **Domain**: Entidades de negócio e contratos (interfaces)
- **Application**: Use Cases, DTOs, Application Controllers
- **Infrastructure**: Implementações concretas (Prisma, Express, etc.)

## 🚀 Início Rápido com Docker Compose

Este repositório inclui um `docker-compose.yml` independente para executar o serviço isoladamente com seu próprio banco de dados PostgreSQL.

### Pré-requisitos
- Docker e Docker Compose instalados
- Keycloak em execução (para autenticação JWT)

### Configuração do Ambiente

1. **Copiar arquivo de ambiente**:
```bash
cp .env.example .env
```

2. **Configurar ambiente** (editar `.env`):
```bash
# Database
DB_NAME=fiap_read_api_db
DB_USER=fiap_read_user
DB_PASSWORD=fiap_read_password
DB_PORT=5434

# Development Service
DEV_PORT=3003

# Production Service  
PRD_PORT=3004

# Keycloak (must be accessible)
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=fiap-pos-tech
KEYCLOAK_CLIENT_ID=pos-tech-api
```

### Executando em Modo de Desenvolvimento

O modo de desenvolvimento inclui hot-reload para alterações de código:

```bash
# Iniciar banco de dados e serviço de desenvolvimento
docker compose --profile dev up -d

# Ver logs
docker compose logs -f fiap-pos-tech-api-sale-dev

# Parar serviços
docker compose --profile dev down
```

Acesse o serviço em: http://localhost:3003

### Executando em Modo de Produção

O modo de produção usa build otimizada:

```bash
# Compilar e iniciar banco de dados e serviço de produção
docker compose --profile prd up -d --build

# Ver logs
docker compose logs -f fiap-pos-tech-api-sale-prd

# Parar serviços
docker compose --profile prd down
```

Acesse o serviço em: http://localhost:3004

### Gerenciamento do Banco de Dados

```bash
# Acessar banco de dados
docker exec -it fiap-pos-tech-api-sale-db psql -U fiap_read_user -d fiap_read_api_db

# Executar migrações (do container)
docker exec -it fiap-pos-tech-api-sale-dev npx prisma migrate dev

# Ver logs do banco de dados
docker compose logs fiap-pos-tech-api-sale-db
```

### Comandos Úteis

```bash
# Reconstruir serviços
docker compose --profile dev build
docker compose --profile prd build

# Remover todos os dados (incluindo volume do banco de dados)
docker compose down -v

# Ver status de todos os serviços
docker compose ps
```

## 🚀 Desenvolvimento

### Pré-requisitos

- Node.js 22+
- PostgreSQL 15
- Keycloak (para autenticação)

### Variáveis de Ambiente

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Server
PORT=3003
NODE_ENV=development

# Keycloak (JWT validation)
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=fiap-pos-tech
KEYCLOAK_CLIENT_ID=pos-tech-api
```

### Instalação Local

```bash
# Instalar dependências
yarn install

# Gerar Prisma Client
npx prisma generate

# Modo desenvolvimento (hot-reload)
yarn dev

# Build para produção
yarn build
yarn start
```

### Docker

Este serviço está integrado ao `docker-compose.yml` do ambiente de desenvolvimento:

```bash
# Ver logs do serviço
docker-compose logs -f fiap-pos-tech-api-sale

# Acessar shell do container
docker-compose exec fiap-pos-tech-api-sale sh

# Restart do serviço
docker-compose restart fiap-pos-tech-api-sale
```

## 📚 Documentação da API

Acesse http://localhost:3003/api-docs para visualizar a documentação interativa Swagger.

## 🧪 Testes

```bash
# Executar todos os testes
yarn test

# Modo watch
yarn test:watch
```

## 🔐 Autenticação

Todos os endpoints requerem um token JWT válido obtido através do serviço de autenticação:

```bash
# 1. Obter token
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password"}'

# 2. Usar token nas requisições
curl http://localhost:3003/api/v1/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Tecnologias

- **Runtime**: Node.js 22
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **Auth**: Keycloak (JWT)
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📄 Licença

MIT

---

**FIAP Pós-Tech** - Software Architecture | Tech Challenge
