# FIAP Pós-Tech API Sale

API de vendas e consulta de veículos - Tech Challenge | Software Architecture FIAP

## 📋 Descrição

Serviço responsável por gestão de vendas de veículos e consultas. Mantém seu próprio banco de dados e integra-se com a API principal para sincronizar dados de clientes e veículos durante o processo de venda.

## 🎯 Endpoints

### Veículos (Autenticado - JWT)
- `GET /api/v1/vehicles/available` - Lista veículos disponíveis
- `GET /api/v1/vehicles/sold` - Lista veículos vendidos com informações de venda

### Vendas
- `POST /api/v1/sales` - Cria uma nova venda (Autenticado - JWT)
- `POST /api/v1/webhook/payment` - Atualiza status de pagamento (Público - webhook)

### Sistema
- `GET /api/v1/health` - Health check
- `GET /api-docs` - Documentação Swagger

## 🏗️ Arquitetura

**Clean Architecture + DDD**

```
src/
├── core/                       # Infraestrutura compartilhada
│   ├── application/            # Use case base, erros
│   ├── domain/                 # Entidades base
│   └── infrastructure/         # Database, DI, HTTP, Swagger
└── modules/
    ├── vehicle_sale/           # Consulta de veículos
    │   ├── domain/             # Entidades, interfaces
    │   ├── application/        # Use cases, DTOs, controllers
    │   └── infrastructure/     # Repositórios, routes
    └── vehicle_sales/          # Gestão de vendas
        ├── domain/             # Sale entity, enums, interfaces
        ├── application/        # Use cases, DTOs, controllers
        └── infrastructure/     # Repositórios, routes
```

### Stack
- **Runtime**: Node.js 22 + TypeScript 5.8
- **Framework**: Express.js 5.1
- **ORM**: Prisma 6.11 + PostgreSQL 15
- **Auth**: Keycloak (JWT via jsonwebtoken + jwks-rsa)
- **Docs**: Swagger/OpenAPI
- **Validação**: Zod 3.25
- **Tests**: Jest 30 (80% coverage configurado)

## 🚀 Quick Start

### Desenvolvimento (com hot-reload)
```bash
docker compose --profile dev up -d
# Acesse: http://localhost:3003
# Logs: docker compose logs -f fiap-pos-tech-api-sale-dev
```

### Produção
```bash
docker compose --profile prd up -d --build
# Acesse: http://localhost:3004
# Logs: docker compose logs -f fiap-pos-tech-api-sale-prd
```

### Gerenciamento do Banco
```bash
# Executar migrações
docker exec -it fiap-pos-tech-api-sale-dev npx prisma migrate dev

# Acessar PostgreSQL
docker exec -it fiap-pos-tech-api-sale-db psql -U fiap_read_user -d fiap_read_api_db

# Limpar volumes (⚠️ remove dados)
docker compose down -v
```

## ⚙️ Variáveis de Ambiente

### Database
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
DB_NAME=fiap_read_api_db
DB_USER=fiap_read_user
DB_PASSWORD=fiap_read_password
DB_PORT=5434
```

### Server
```bash
PORT=3003              # Dev: 3003, Prd: 3004
NODE_ENV=development
DEV_PORT=3003
PRD_PORT=3004
```

### Integração
```bash
MAIN_API_URL=http://fiap-pos-tech-api-dev:3001/api/v1  # URL da API principal
```

### Keycloak (Autenticação JWT)
```bash
KEYCLOAK_URL=http://fiap-keycloak:8080
KEYCLOAK_REALM=fiap-pos-tech
KEYCLOAK_CLIENT_ID=pos-tech-api
```

## 🔐 Autenticação

Endpoints protegidos requerem JWT Bearer token:

```bash
# 1. Obter token (via fiap-pos-tech-auth)
curl -X POST http://localhost:8080/realms/fiap-pos-tech/protocol/openid-connect/token \
  -d "client_id=pos-tech-api" \
  -d "username=user@example.com" \
  -d "password=password" \
  -d "grant_type=password"

# 2. Usar token
curl http://localhost:3003/api/v1/vehicles/available \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 Testes

```bash
yarn test              # Executar testes
yarn test:watch        # Modo watch
```

**Configuração**: Jest com cobertura mínima de 80% (branches, functions, lines, statements)

## 📚 Documentação

Acesse a documentação interativa: **http://localhost:3003/api-docs**

---

**FIAP Pós-Tech** - Software Architecture | Tech Challenge
