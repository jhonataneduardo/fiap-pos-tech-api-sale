import { Request, Response } from 'express';
import { VehicleApiController } from './vehicle-api.controller';
import { container } from '@/core/infrastructure/di/container';
import { VehicleController } from '@/modules/vehicle_sale/application/controllers/vehicle.controller';
import { ApiResponseHandler } from '@/core/infrastructure/http/responses';

jest.mock('@/core/infrastructure/di/container');
jest.mock('@/core/infrastructure/http/responses');

describe('VehicleApiController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockVehicleController: jest.Mocked<VehicleController>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockVehicleController = {
            listAvailableVehicles: jest.fn(),
            listSoldVehicles: jest.fn(),
        } as any;

        (container.resolve as jest.Mock).mockReturnValue(mockVehicleController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAvailableVehicles', () => {
        it('should return available vehicles successfully', async () => {
            // Arrange
            const mockVehicles = [
                { id: '1', brand: 'Toyota', model: 'Corolla', year: 2023, color: 'White', price: 25000 },
            ];
            mockVehicleController.listAvailableVehicles.mockResolvedValue(mockVehicles as any);

            // Act
            await VehicleApiController.getAvailableVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert
            expect(container.resolve).toHaveBeenCalledWith('VehicleController');
            expect(mockVehicleController.listAvailableVehicles).toHaveBeenCalled();
            expect(ApiResponseHandler.success).toHaveBeenCalledWith(mockResponse, mockVehicles);
        });

        it('should handle errors when fetching available vehicles', async () => {
            // Arrange
            const error = new Error('Database error');
            mockVehicleController.listAvailableVehicles.mockRejectedValue(error);

            // Act
            await VehicleApiController.getAvailableVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert
            expect(ApiResponseHandler.error).toHaveBeenCalledWith(mockResponse, error);
        });
    });

    describe('getSoldVehicles', () => {
        it('should return sold vehicles successfully', async () => {
            // Arrange
            const mockSoldVehicles = [
                {
                    vehicle: { id: '1', brand: 'Honda', model: 'Civic' },
                    saleInfo: { customerName: 'John Doe', totalPrice: 28000 },
                },
            ];
            mockVehicleController.listSoldVehicles.mockResolvedValue(mockSoldVehicles as any);

            // Act
            await VehicleApiController.getSoldVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert
            expect(container.resolve).toHaveBeenCalledWith('VehicleController');
            expect(mockVehicleController.listSoldVehicles).toHaveBeenCalled();
            expect(ApiResponseHandler.success).toHaveBeenCalledWith(mockResponse, mockSoldVehicles);
        });

        it('should handle errors when fetching sold vehicles', async () => {
            // Arrange
            const error = new Error('Database error');
            mockVehicleController.listSoldVehicles.mockRejectedValue(error);

            // Act
            await VehicleApiController.getSoldVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert
            expect(ApiResponseHandler.error).toHaveBeenCalledWith(mockResponse, error);
        });
    });
});
