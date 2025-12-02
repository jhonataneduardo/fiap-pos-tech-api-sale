import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { keycloakConfig } from '@config/index';

// Estende o tipo Request do Express para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                email?: string;
                preferred_username?: string;
                given_name?: string;
                family_name?: string;
                [key: string]: any;
            };
        }
    }
}

// Cliente JWKS para obter a chave pública do Keycloak
const client = jwksClient({
    jwksUri: `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/certs`,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000, // 10 minutos
});

/**
 * Obtém a chave de assinatura do Keycloak
 */
function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
}

/**
 * Middleware de autenticação JWT
 * Valida o token JWT emitido pelo Keycloak usando a chave pública
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extrai o token do header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Token de autenticação não fornecido',
                },
            });
            return;
        }

        // Verifica o formato "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN_FORMAT',
                    message: 'Formato de token inválido. Use: Bearer <token>',
                },
            });
            return;
        }

        const token = parts[1];

        // Aceita tanto o issuer interno (fiap-keycloak) quanto externo (localhost)
        // Isso é necessário porque o Keycloak emite tokens com localhost:8080
        // mas as APIs se comunicam internamente via fiap-keycloak:8080
        const validIssuers = [
            `${keycloakConfig.url}/realms/${keycloakConfig.realm}`, // http://fiap-keycloak:8080/realms/fiap-pos-tech
            `http://localhost:8080/realms/${keycloakConfig.realm}`, // http://localhost:8080/realms/fiap-pos-tech
        ];

        // Verifica e valida o token JWT usando a chave pública do Keycloak
        jwt.verify(
            token,
            getKey,
            {
                algorithms: ['RS256'],
                issuer: validIssuers as any, // Aceita múltiplos issuers
            },
            (err: any, decoded: any) => {
                if (err) {
                    let message = 'Token inválido';

                    if (err.name === 'TokenExpiredError') {
                        message = 'Token expirado';
                    } else if (err.name === 'JsonWebTokenError') {
                        message = 'Token malformado ou inválido';
                    } else if (err.name === 'NotBeforeError') {
                        message = 'Token ainda não é válido';
                    }

                    res.status(401).json({
                        success: false,
                        error: {
                            code: 'INVALID_TOKEN',
                            message,
                        },
                    });
                    return;
                }

                // Adiciona as informações do usuário ao request
                req.user = decoded as Express.Request['user'];

                next();
            }
        );
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Erro ao validar autenticação',
            },
        });
    }
};
