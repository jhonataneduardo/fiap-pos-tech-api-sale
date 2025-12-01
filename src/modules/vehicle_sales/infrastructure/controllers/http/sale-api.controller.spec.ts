import { Request, Response } from 'express';
import { SaleApiController } from './sale-api.controller';
import { container } from '@/core/infrastructure/di/container';
import { SaleController } from '@/modules/vehicle_sales/application/controllers/sale.controller';
import { ApiResponseHandler } from '@/core/infrastructure/http/responses';
import { SaleStatus } from '@/modules/vehicle_sales/domain/entities/enums';

jest.mock('@/core/infrastructure/di/container');
jest.mock('@/core/infrastructure/http/responses');

describe('SaleApiController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockSaleController: jest.Mocked<SaleController>;

    beforeEach(() => {
        mockRequest = {
            body: {},
            headers: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockSaleController = {
            registerSale: jest.fn(),
            updatePaymentStatus: jest.fn(),
        } as any;

        (container.resolve as jest.Mock).mockReturnValue(mockSaleController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createSale', () => {
        it('should create a sale successfully', async () => {
            // Arrange
            mockRequest.body = {
                vehicle_id: 'vehicle-123',
                customer_national_id: '12345678900',
            };
            mockRequest.headers = {
                authorization: 'Bearer test-token',
            };

            const mockSale = {
                id: 'sale-123',
                vehicle_id: 'vehicle-123',
                customer_id: 'customer-123',
                payment_code: 'PAY-12345678',
                status: SaleStatus.PENDING,
            };

            mockSaleController.registerSale.mockResolvedValue(mockSale as any);

            // Act
            await SaleApiController.createSale(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert
            expect(container.resolve).toHaveBeenCalledWith('SaleController');
            expect(mockSaleController.registerSale).toHaveBeenCalledWith({
                vehicle_id: 'vehicle-123',
                customer_national_id: '12345678900',
                token: 'test-token',
            });
            expect(ApiResponseHandler.success).toHaveBeenCalledWith(mockResponse, mockSale, 201);
        });

        it('should handle missing authorization header', async () => {
            // Arrange
            mockRequest.body = {
                vehicle_id: 'vehicle-123',
                customer_national_id: '12345678900',
            };
            mockRequest.headers = {};

            const mockSale = { id: 'sale-123' };
            mockSaleController.registerSale.mockResolvedValue(mockSale as any);

            // Act
            await SaleApiController.createSale(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert
            expect(mockSaleController.registerSale).toHaveBeenCalledWith({
                vehicle_id: 'vehicle-123',
                customer_national_id: '12345678900',
                token: undefined,
            });
        });

        it('should handle errors when creating sale', async () => {
            // Arrange
            mockRequest.body = {
                vehicle_id: 'vehicle-123',
                customer_national_id: '12345678900',
            };

            const error = new Error('Customer not found');
            mockSaleController.registerSale.mockRejectedValue(error);

            // Act
            await SaleApiController.createSale(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert
            expect(ApiResponseHandler.error).toHaveBeenCalledWith(mockResponse, error);
        });
    });

    describe('updatePaymentStatus', () => {
        it('should update payment status successfully', async () => {
            // Arrange
            mockRequest.body = {
                payment_code: 'PAY-12345678',
                status: SaleStatus.PAID,
            };

            const mockResult = {
                payment_code: 'PAY-12345678',
                previous_status: SaleStatus.PENDING,
                new_status: SaleStatus.PAID,
            };

            mockSaleController.updatePaymentStatus.mockResolvedValue(mockResult as any);

            // Act
            await SaleApiController.updatePaymentStatus(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert
            expect(container.resolve).toHaveBeenCalledWith('SaleController');
            expect(mockSaleController.updatePaymentStatus).toHaveBeenCalledWith({
                payment_code: 'PAY-12345678',
                status: SaleStatus.PAID,
            });
            expect(ApiResponseHandler.success).toHaveBeenCalledWith(mockResponse, mockResult);
        });

        it('should handle errors when updating payment status', async () => {
            // Arrange
            mockRequest.body = {
                payment_code: 'PAY-12345678',
                status: SaleStatus.PAID,
            };

            const error = new Error('Payment code not found');
            mockSaleController.updatePaymentStatus.mockRejectedValue(error);

            // Act
            await SaleApiController.updatePaymentStatus(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert
            expect(ApiResponseHandler.error).toHaveBeenCalledWith(mockResponse, error);
        });
    });
});
