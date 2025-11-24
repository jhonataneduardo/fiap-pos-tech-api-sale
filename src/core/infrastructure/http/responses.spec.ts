import { ApiResponseHandler } from './responses';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@core/application/errors/app.error';
import { Response } from 'express';

describe('ApiResponseHandler', () => {
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockResponse = {
            status: statusMock,
            json: jsonMock,
        };
    });

    describe('success', () => {
        it('should return success response with default status 200', () => {
            const data = { id: '1', name: 'Test Vehicle' };

            ApiResponseHandler.success(mockResponse as Response, data);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                content: data,
            });
        });

        it('should return success response with custom status', () => {
            const data = { created: true };

            ApiResponseHandler.success(mockResponse as Response, data, 201);

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                content: data,
            });
        });

        it('should handle null or undefined data', () => {
            ApiResponseHandler.success(mockResponse as Response, null);

            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                content: null,
            });
        });

        it('should handle array data', () => {
            const data = [{ id: '1' }, { id: '2' }];

            ApiResponseHandler.success(mockResponse as Response, data);

            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                content: data,
            });
        });
    });

    describe('error', () => {
        it('should handle NotFoundError with 404 status', () => {
            const error = new NotFoundError('Vehicle not found');

            ApiResponseHandler.error(mockResponse as Response, error);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Vehicle not found',
                },
            });
        });

        it('should handle UnauthorizedError with 401 status', () => {
            const error = new UnauthorizedError('Invalid token');

            ApiResponseHandler.error(mockResponse as Response, error);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid token',
                },
            });
        });

        it('should handle BadRequestError with 400 status', () => {
            const error = new BadRequestError('Invalid input');

            ApiResponseHandler.error(mockResponse as Response, error);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'BAD_REQUEST',
                    message: 'Invalid input',
                },
            });
        });

        it('should handle generic errors with 500 status and generic message', () => {
            const error = new Error('Database connection failed');

            ApiResponseHandler.error(mockResponse as Response, error);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Internal server error',
                },
            });
        });

        it('should map NotFoundError correctly', () => {
            const error = new NotFoundError();

            ApiResponseHandler.error(mockResponse as Response, error);

            const errorCall = jsonMock.mock.calls[0][0];
            expect(errorCall.error.code).toBe('NOT_FOUND');
            expect(errorCall.error.message).toBe('Resource not found');
        });
    });

    describe('error response structure', () => {
        it('should always have success: false in error responses', () => {
            const error = new Error('Test error');

            ApiResponseHandler.error(mockResponse as Response, error);

            const response = jsonMock.mock.calls[0][0];
            expect(response.success).toBe(false);
        });

        it('should not have content field in error responses', () => {
            const error = new Error('Test error');

            ApiResponseHandler.error(mockResponse as Response, error);

            const response = jsonMock.mock.calls[0][0];
            expect(response).not.toHaveProperty('content');
            expect(response).toHaveProperty('error');
        });
    });
});
