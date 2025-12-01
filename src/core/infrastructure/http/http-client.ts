import axios, { AxiosInstance, AxiosError } from 'axios';
import { NotFoundError, BadRequestError, UnauthorizedError } from '@core/application/errors/app.error';

export interface HttpClientConfig {
    baseURL: string;
    timeout?: number;
    retries?: number;
}

export class HttpClient {
    private client: AxiosInstance;
    private retries: number;

    constructor(config: HttpClientConfig) {
        this.retries = config.retries || 3;
        this.client = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 5000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response) {
                    // Server responded with error status
                    const status = error.response.status;
                    const message = (error.response.data as any)?.message || error.message;
                    
                    // Map HTTP status codes to appropriate errors
                    if (status === 404) {
                        throw new NotFoundError(message);
                    } else if (status === 400) {
                        throw new BadRequestError(message);
                    } else if (status === 401 || status === 403) {
                        throw new UnauthorizedError(message);
                    } else {
                        throw new Error(`HTTP ${status}: ${message}`);
                    }
                } else if (error.request) {
                    // Request made but no response received
                    throw new Error('Service unavailable. Please try again later.');
                } else {
                    // Error in request setup
                    throw new Error(`Request setup failed: ${error.message}`);
                }
            }
        );
    }

    async get<T>(path: string, token?: string): Promise<T> {
        try {
            const response = await this.client.get(path, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            
            // Handle API response format with 'content' wrapper
            return response.data.content || response.data;
        } catch (error) {
            throw error;
        }
    }

    async post<T>(path: string, data: any, token?: string): Promise<T> {
        try {
            const response = await this.client.post(path, data, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            
            // Handle API response format with 'content' wrapper
            return response.data.content || response.data;
        } catch (error) {
            throw error;
        }
    }

    async patch<T>(path: string, data: any, token?: string): Promise<T> {
        try {
            const response = await this.client.patch(path, data, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            
            // Handle API response format with 'content' wrapper
            return response.data.content || response.data;
        } catch (error) {
            throw error;
        }
    }

    async delete<T>(path: string, token?: string): Promise<T> {
        try {
            const response = await this.client.delete(path, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            
            // Handle API response format with 'content' wrapper
            return response.data.content || response.data;
        } catch (error) {
            throw error;
        }
    }
}
