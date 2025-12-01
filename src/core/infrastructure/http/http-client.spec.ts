import { HttpClient } from './http-client';
import axios from 'axios';
import { NotFoundError, BadRequestError, UnauthorizedError } from '@core/application/errors/app.error';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
    let httpClient: HttpClient;
    let mockAxiosInstance: any;

    beforeEach(() => {
        mockAxiosInstance = {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
            interceptors: {
                response: {
                    use: jest.fn((success, error) => {
                        // Store the error handler for testing
                        mockAxiosInstance.errorHandler = error;
                        return 0;
                    }),
                },
            },
        };

        mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

        httpClient = new HttpClient({
            baseURL: 'https://api.example.com',
            timeout: 5000,
            retries: 3,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should create axios instance with correct config', () => {
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: 'https://api.example.com',
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });

        it('should use default timeout if not provided', () => {
            new HttpClient({ baseURL: 'https://api.example.com' });
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: 'https://api.example.com',
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
    });

    describe('get', () => {
        it('should make GET request successfully', async () => {
            // Arrange
            const mockData = { id: '1', name: 'Test' };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            // Act
            const result = await httpClient.get<typeof mockData>('/test');

            // Assert
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
                headers: {},
            });
            expect(result).toEqual(mockData);
        });

        it('should make GET request with authorization token', async () => {
            // Arrange
            const mockData = { id: '1', name: 'Test' };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            // Act
            const result = await httpClient.get<typeof mockData>('/test', 'bearer-token');

            // Assert
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
                headers: { Authorization: 'Bearer bearer-token' },
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('post', () => {
        it('should make POST request successfully', async () => {
            // Arrange
            const requestData = { name: 'Test' };
            const mockResponse = { id: '1', name: 'Test' };
            mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

            // Act
            const result = await httpClient.post<typeof mockResponse>('/test', requestData);

            // Assert
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', requestData, {
                headers: {},
            });
            expect(result).toEqual(mockResponse);
        });

        it('should make POST request with authorization token', async () => {
            // Arrange
            const requestData = { name: 'Test' };
            const mockResponse = { id: '1', name: 'Test' };
            mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

            // Act
            const result = await httpClient.post<typeof mockResponse>('/test', requestData, 'bearer-token');

            // Assert
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', requestData, {
                headers: { Authorization: 'Bearer bearer-token' },
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('patch', () => {
        it('should make PATCH request successfully', async () => {
            // Arrange
            const requestData = { name: 'Updated' };
            const mockResponse = { id: '1', name: 'Updated' };
            mockAxiosInstance.patch.mockResolvedValue({ data: mockResponse });

            // Act
            const result = await httpClient.patch<typeof mockResponse>('/test/1', requestData);

            // Assert
            expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/test/1', requestData, {
                headers: {},
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('delete', () => {
        it('should make DELETE request successfully', async () => {
            // Arrange
            mockAxiosInstance.delete.mockResolvedValue({ data: {} });

            // Act
            await httpClient.delete('/test/1');

            // Assert
            expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', {
                headers: {},
            });
        });

        it('should handle response with content wrapper', async () => {
            // Arrange
            mockAxiosInstance.delete.mockResolvedValue({ data: { content: { deleted: true } } });

            // Act
            const result = await httpClient.delete<{ deleted: boolean }>('/test/1');

            // Assert
            expect(result).toEqual({ deleted: true });
        });
    });

    describe('patch', () => {
        it('should handle response with content wrapper', async () => {
            // Arrange
            const requestData = { status: 'active' };
            mockAxiosInstance.patch.mockResolvedValue({ data: { content: { id: '1', status: 'active' } } });

            // Act
            const result = await httpClient.patch('/test/1', requestData);

            // Assert
            expect(result).toEqual({ id: '1', status: 'active' });
        });
    });

    describe('get with content wrapper', () => {
        it('should extract content from response', async () => {
            // Arrange
            const mockData = { items: ['test1', 'test2'] };
            mockAxiosInstance.get.mockResolvedValue({ data: { content: mockData } });

            // Act
            const result = await httpClient.get('/test');

            // Assert
            expect(result).toEqual(mockData);
        });
    });

    describe('post with content wrapper', () => {
        it('should extract content from response', async () => {
            // Arrange
            const requestData = { name: 'New Item' };
            const mockData = { id: '123', name: 'New Item' };
            mockAxiosInstance.post.mockResolvedValue({ data: { content: mockData } });

            // Act
            const result = await httpClient.post('/test', requestData);

            // Assert
            expect(result).toEqual(mockData);
        });
    });
});
