import { authenticate } from './auth.middleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

jest.mock('jsonwebtoken');
jest.mock('jwks-rsa');
jest.mock('@config/index', () => ({
    keycloakConfig: {
        url: 'http://localhost:8080',
        realm: 'fiap-pos-tech',
        clientId: 'pos-tech-api',
    },
}));

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        mockRequest = {
            headers: {},
        };

        mockResponse = {
            status: statusMock,
            json: jsonMock,
        };

        mockNext = jest.fn();

        jest.clearAllMocks();
    });

    describe('authenticate', () => {
        it('should return 401 when no authorization header is provided', async () => {
            mockRequest.headers = {};

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Token de autenticação não fornecido',
                },
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when authorization header has invalid format', async () => {
            mockRequest.headers = {
                authorization: 'InvalidFormat',
            };

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INVALID_TOKEN_FORMAT',
                    message: 'Formato de token inválido. Use: Bearer <token>',
                },
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when authorization header does not start with Bearer', async () => {
            mockRequest.headers = {
                authorization: 'Basic sometoken',
            };

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INVALID_TOKEN_FORMAT',
                    message: 'Formato de token inválido. Use: Bearer <token>',
                },
            });
        });

        it('should call next() with valid token', async () => {
            const mockToken = 'valid.jwt.token';
            const mockDecoded = {
                sub: 'user-id',
                email: 'user@example.com',
                preferred_username: 'testuser',
            };

            mockRequest.headers = {
                authorization: `Bearer ${mockToken}`,
            };

            (jwt.verify as jest.Mock).mockImplementation(
                (token, getKey, options, callback) => {
                    callback(null, mockDecoded);
                }
            );

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalled();
            expect(mockRequest.user).toEqual(mockDecoded);
            expect(statusMock).not.toHaveBeenCalled();
        });

        it('should return 401 when token is expired', async () => {
            const mockToken = 'expired.jwt.token';
            const expiredError = new Error('Token expired');
            (expiredError as any).name = 'TokenExpiredError';

            mockRequest.headers = {
                authorization: `Bearer ${mockToken}`,
            };

            (jwt.verify as jest.Mock).mockImplementation(
                (token, getKey, options, callback) => {
                    callback(expiredError);
                }
            );

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Token expirado',
                },
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when token is malformed', async () => {
            const mockToken = 'malformed.token';
            const jwtError = new Error('jwt malformed');
            (jwtError as any).name = 'JsonWebTokenError';

            mockRequest.headers = {
                authorization: `Bearer ${mockToken}`,
            };

            (jwt.verify as jest.Mock).mockImplementation(
                (token, getKey, options, callback) => {
                    callback(jwtError);
                }
            );

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Token malformado ou inválido',
                },
            });
        });

        it('should return 401 when token is not yet valid', async () => {
            const mockToken = 'future.token';
            const notBeforeError = new Error('jwt not active');
            (notBeforeError as any).name = 'NotBeforeError';

            mockRequest.headers = {
                authorization: `Bearer ${mockToken}`,
            };

            (jwt.verify as jest.Mock).mockImplementation(
                (token, getKey, options, callback) => {
                    callback(notBeforeError);
                }
            );

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Token ainda não é válido',
                },
            });
        });

        it('should extract token correctly from Bearer header', async () => {
            const mockToken = 'test.jwt.token';
            mockRequest.headers = {
                authorization: `Bearer ${mockToken}`,
            };

            (jwt.verify as jest.Mock).mockImplementation(
                (token, getKey, options, callback) => {
                    expect(token).toBe(mockToken);
                    callback(null, { sub: 'user-id' });
                }
            );

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalled();
        });
    });
});
