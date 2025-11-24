import { VehicleApiController } from './vehicle-api.controller';
import { Request, Response } from 'express';
import { container } from '@/core/infrastructure/di/container';
import { VehicleController } from '@/modules/vehicle_read/application/controllers/vehicle.controller';
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
            listAllVehicles: jest.fn(),
            listAvailableVehicles: jest.fn(),
            listSoldVehicles: jest.fn(),
        } as any;

        (container.resolve as jest.Mock).mockReturnValue(mockVehicleController);
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('getAllVehicles', () => {
        it('should return all vehicles successfully', async () => {
            const mockVehicles = [
                { id: '1', brand: 'Toyota', model: 'Corolla' },
                { id: '2', brand: 'Honda', model: 'Civic' },
            ];

            mockVehicleController.listAllVehicles.mockResolvedValue(mockVehicles as any);

            await VehicleApiController.getAllVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(container.resolve).toHaveBeenCalledWith('VehicleController');
            expect(mockVehicleController.listAllVehicles).toHaveBeenCalled();
            expect(ApiResponseHandler.success).toHaveBeenCalledWith(mockResponse, mockVehicles);
        });

        it('should handle errors and return error response', async () => {
            const error = new Error('Database error');
            mockVehicleController.listAllVehicles.mockRejectedValue(error);

            await VehicleApiController.getAllVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(console.error).toHaveBeenCalledWith('Error fetching vehicles:', error);
            expect(ApiResponseHandler.error).toHaveBeenCalledWith(mockResponse, error);
        });
    });

    describe('getAvailableVehicles', () => {
        it('should return available vehicles successfully', async () => {
            const mockVehicles = [
                { id: '1', brand: 'Toyota', model: 'Corolla' },
            ];

            mockVehicleController.listAvailableVehicles.mockResolvedValue(mockVehicles as any);

            await VehicleApiController.getAvailableVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(container.resolve).toHaveBeenCalledWith('VehicleController');
            expect(mockVehicleController.listAvailableVehicles).toHaveBeenCalled();
            expect(ApiResponseHandler.success).toHaveBeenCalledWith(mockResponse, mockVehicles);
        });

        it('should handle errors and return error response', async () => {
            const error = new Error('Query failed');
            mockVehicleController.listAvailableVehicles.mockRejectedValue(error);

            await VehicleApiController.getAvailableVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(console.error).toHaveBeenCalledWith('Error fetching available vehicles:', error);
            expect(ApiResponseHandler.error).toHaveBeenCalledWith(mockResponse, error);
        });
    });

    describe('getSoldVehicles', () => {
        it('should return sold vehicles successfully', async () => {
            const mockSoldVehicles = [
                {
                    vehicle: { id: '1', brand: 'Toyota', model: 'Corolla' },
                    saleInfo: { saleDate: new Date(), customerName: 'John' },
                },
            ];

            mockVehicleController.listSoldVehicles.mockResolvedValue(mockSoldVehicles as any);

            await VehicleApiController.getSoldVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(container.resolve).toHaveBeenCalledWith('VehicleController');
            expect(mockVehicleController.listSoldVehicles).toHaveBeenCalled();
            expect(ApiResponseHandler.success).toHaveBeenCalledWith(mockResponse, mockSoldVehicles);
        });

        it('should handle errors and return error response', async () => {
            const error = new Error('Fetch failed');
            mockVehicleController.listSoldVehicles.mockRejectedValue(error);

            await VehicleApiController.getSoldVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(console.error).toHaveBeenCalledWith('Error fetching sold vehicles:', error);
            expect(ApiResponseHandler.error).toHaveBeenCalledWith(mockResponse, error);
        });
    });
});
