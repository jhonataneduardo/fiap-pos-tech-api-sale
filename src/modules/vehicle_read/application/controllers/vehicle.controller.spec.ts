import { VehicleController } from './vehicle.controller';
import { ListAllVehiclesUseCase } from '../usecases/list-all-vehicles.usecase';
import { FindAvailableVehiclesUseCase } from '../usecases/find-available-vehicles.usecase';
import { FindSoldVehiclesUseCase } from '../usecases/find-sold-vehicles.usecase';
import { ListVehiclesPresenter } from '@/modules/vehicle_read/infrastructure/presenters/list-vehicles.presenter';
import { AvailableVehiclesPresenter } from '@/modules/vehicle_read/infrastructure/presenters/available-vehicles.presenter';
import { SoldVehiclesPresenter } from '@/modules/vehicle_read/infrastructure/presenters/sold-vehicles.presenter';
import { VehicleEntity } from '@/modules/vehicle_read/domain/entities/vehicle.entity';
import { SoldVehicle } from '@/modules/vehicle_read/domain/repositories/vehicle-repository.interface';

jest.mock('@/modules/vehicle_read/infrastructure/presenters/list-vehicles.presenter');
jest.mock('@/modules/vehicle_read/infrastructure/presenters/available-vehicles.presenter');
jest.mock('@/modules/vehicle_read/infrastructure/presenters/sold-vehicles.presenter');

describe('VehicleController', () => {
    let controller: VehicleController;
    let mockListAllUseCase: jest.Mocked<ListAllVehiclesUseCase>;
    let mockFindAvailableUseCase: jest.Mocked<FindAvailableVehiclesUseCase>;
    let mockFindSoldUseCase: jest.Mocked<FindSoldVehiclesUseCase>;

    beforeEach(() => {
        mockListAllUseCase = {
            execute: jest.fn(),
        } as any;

        mockFindAvailableUseCase = {
            execute: jest.fn(),
        } as any;

        mockFindSoldUseCase = {
            execute: jest.fn(),
        } as any;

        controller = new VehicleController(
            mockListAllUseCase,
            mockFindAvailableUseCase,
            mockFindSoldUseCase
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('listAllVehicles', () => {
        it('should call use case and presenter correctly', async () => {
            const mockVehicles: VehicleEntity[] = [
                new VehicleEntity({
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2024,
                    color: 'Silver',
                    price: 85000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];

            const mockPresentedData = [
                {
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2024,
                    color: 'Silver',
                    price: 85000,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                },
            ];

            mockListAllUseCase.execute.mockResolvedValue(mockVehicles);
            (ListVehiclesPresenter.present as jest.Mock).mockReturnValue(mockPresentedData);

            const result = await controller.listAllVehicles();

            expect(mockListAllUseCase.execute).toHaveBeenCalledTimes(1);
            expect(ListVehiclesPresenter.present).toHaveBeenCalledWith(mockVehicles);
            expect(result).toEqual(mockPresentedData);
        });

        it('should propagate use case errors', async () => {
            const error = new Error('Use case failed');
            mockListAllUseCase.execute.mockRejectedValue(error);

            await expect(controller.listAllVehicles()).rejects.toThrow('Use case failed');
        });
    });

    describe('listAvailableVehicles', () => {
        it('should call use case and presenter correctly', async () => {
            const mockVehicles: VehicleEntity[] = [
                new VehicleEntity({
                    id: '2',
                    brand: 'Honda',
                    model: 'Civic',
                    year: 2023,
                    color: 'Black',
                    price: 95000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];

            const mockPresentedData = [
                {
                    id: '2',
                    brand: 'Honda',
                    model: 'Civic',
                    year: 2023,
                    color: 'Black',
                    price: 95000,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                },
            ];

            mockFindAvailableUseCase.execute.mockResolvedValue(mockVehicles);
            (AvailableVehiclesPresenter.present as jest.Mock).mockReturnValue(mockPresentedData);

            const result = await controller.listAvailableVehicles();

            expect(mockFindAvailableUseCase.execute).toHaveBeenCalledTimes(1);
            expect(AvailableVehiclesPresenter.present).toHaveBeenCalledWith(mockVehicles);
            expect(result).toEqual(mockPresentedData);
        });

        it('should propagate use case errors', async () => {
            const error = new Error('Available vehicles fetch failed');
            mockFindAvailableUseCase.execute.mockRejectedValue(error);

            await expect(controller.listAvailableVehicles()).rejects.toThrow('Available vehicles fetch failed');
        });
    });

    describe('listSoldVehicles', () => {
        it('should call use case and presenter correctly', async () => {
            const mockSoldVehicles: SoldVehicle[] = [
                {
                    vehicle: new VehicleEntity({
                        id: '3',
                        brand: 'Ford',
                        model: 'Focus',
                        year: 2022,
                        color: 'White',
                        price: 75000,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }),
                    saleInfo: {
                        saleDate: new Date('2024-01-15'),
                        totalPrice: 75000,
                        customerName: 'Jane Doe',
                        customerEmail: 'jane@example.com',
                    },
                },
            ];

            const mockPresentedData = [
                {
                    vehicle: {
                        id: '3',
                        brand: 'Ford',
                        model: 'Focus',
                        year: 2022,
                        color: 'White',
                        price: 75000,
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    },
                    saleInfo: {
                        saleDate: new Date('2024-01-15'),
                        totalPrice: 75000,
                        customerName: 'Jane Doe',
                        customerEmail: 'jane@example.com',
                    },
                },
            ];

            mockFindSoldUseCase.execute.mockResolvedValue(mockSoldVehicles);
            (SoldVehiclesPresenter.present as jest.Mock).mockReturnValue(mockPresentedData);

            const result = await controller.listSoldVehicles();

            expect(mockFindSoldUseCase.execute).toHaveBeenCalledTimes(1);
            expect(SoldVehiclesPresenter.present).toHaveBeenCalledWith(mockSoldVehicles);
            expect(result).toEqual(mockPresentedData);
        });

        it('should propagate use case errors', async () => {
            const error = new Error('Sold vehicles fetch failed');
            mockFindSoldUseCase.execute.mockRejectedValue(error);

            await expect(controller.listSoldVehicles()).rejects.toThrow('Sold vehicles fetch failed');
        });
    });
});
