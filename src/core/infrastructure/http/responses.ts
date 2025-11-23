import { Response } from 'express';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@core/application/errors/app.error';

export interface ApiResponse<T = unknown> {
    success: boolean;
    content?: T;
    error?: {
        code: string;
        message: string;
    };
}

export class ApiResponseHandler {
    static success<T>(res: Response, data: T, status: number = 200): Response {
        const response: ApiResponse<T> = {
            success: true,
            content: data
        };
        return res.status(status).json(response);
    }

    static error(res: Response, error: Error): Response {
        const response: ApiResponse = {
            success: false,
            error: this.mapError(error)
        };

        return res.status(this.getStatusCode(error)).json(response);
    }

    private static mapError(error: Error): { code: string; message: string } {
        if (error instanceof NotFoundError) {
            return { code: 'NOT_FOUND', message: error.message };
        }
        if (error instanceof UnauthorizedError) {
            return { code: 'UNAUTHORIZED', message: error.message };
        }
        if (error instanceof BadRequestError) {
            return { code: 'BAD_REQUEST', message: error.message };
        }

        // Default error
        return { code: 'INTERNAL_ERROR', message: 'Internal server error' };
    }

    private static getStatusCode(error: Error): number {
        if (error instanceof NotFoundError) {
            return 404;
        }
        if (error instanceof UnauthorizedError) {
            return 401;
        }
        if (error instanceof BadRequestError) {
            return 400;
        }

        return 500;
    }
}
