import dotenv from 'dotenv';

dotenv.config();

export const systemConfig = {
    port: process.env.PORT || 3003,
    databaseUrl: process.env.DATABASE_URL,
};

export const keycloakConfig = {
    url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'fiap-pos-tech',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'pos-tech-api',
};
