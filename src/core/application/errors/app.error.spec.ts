import { NotFoundError, BadRequestError, UnauthorizedError } from './app.error';

describe('Application Errors', () => {
    describe('NotFoundError', () => {
        it('should create error with default message', () => {
            const error = new NotFoundError();

            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe('NotFoundError');
            expect(error.message).toBe('Resource not found');
        });

        it('should create error with custom message', () => {
            const customMessage = 'Vehicle not found';
            const error = new NotFoundError(customMessage);

            expect(error.name).toBe('NotFoundError');
            expect(error.message).toBe(customMessage);
        });

        it('should have correct prototype chain', () => {
            const error = new NotFoundError();

            expect(error instanceof NotFoundError).toBe(true);
            expect(error instanceof Error).toBe(true);
        });
    });

    describe('BadRequestError', () => {
        it('should create error with default message', () => {
            const error = new BadRequestError();

            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe('BadRequestError');
            expect(error.message).toBe('Bad request');
        });

        it('should create error with custom message', () => {
            const customMessage = 'Invalid vehicle data';
            const error = new BadRequestError(customMessage);

            expect(error.name).toBe('BadRequestError');
            expect(error.message).toBe(customMessage);
        });

        it('should have correct prototype chain', () => {
            const error = new BadRequestError();

            expect(error instanceof BadRequestError).toBe(true);
            expect(error instanceof Error).toBe(true);
        });
    });

    describe('UnauthorizedError', () => {
        it('should create error with default message', () => {
            const error = new UnauthorizedError();

            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe('UnauthorizedError');
            expect(error.message).toBe('Unauthorized');
        });

        it('should create error with custom message', () => {
            const customMessage = 'Invalid authentication token';
            const error = new UnauthorizedError(customMessage);

            expect(error.name).toBe('UnauthorizedError');
            expect(error.message).toBe(customMessage);
        });

        it('should have correct prototype chain', () => {
            const error = new UnauthorizedError();

            expect(error instanceof UnauthorizedError).toBe(true);
            expect(error instanceof Error).toBe(true);
        });
    });
});
