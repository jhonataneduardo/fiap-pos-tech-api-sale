import { VehicleController } from './vehicle.controller';
import { FindAvailableVehiclesUseCase } from '../usecases/find-available-vehicles.usecase';
import { FindSoldVehiclesUseCase } from '../usecases/find-sold-vehicles.usecase';
import { VehicleEntity } from '@/modules/vehicle_sale/domain/entities/vehicle.entity';
import { SoldVehicle } from '@/modules/vehicle_sale/domain/repositories/vehicle-repository.interface';

describe('VehicleController', () => {
    let controller: VehicleController;
    let findAvailableVehiclesUseCase: jest.Mocked<FindAvailableVehiclesUseCase>;
    let findSoldVehiclesUseCase: jest.Mocked<FindSoldVehiclesUseCase>;

    beforeEach(() => {
        findAvailableVehiclesUseCase = {
            execute: jest.fn(),
        } as any;

        findSoldVehiclesUseCase = {
            execute: jest.fn(),
        } as any;

        controller = new VehicleController(
            findAvailableVehiclesUseCase,
            findSoldVehiclesUseCase
        );
    });

    describe('listAvailableVehicles', () => {
        it('should return formatted available vehicles', async () => {
            // Arrange
            const mockVehicles: VehicleEntity[] = [
                new VehicleEntity({
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2023,
                    color: 'White',
                    price: 25000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];
            findAvailableVehiclesUseCase.execute.mockResolvedValue(mockVehicles);

            // Act
            const result = await controller.listAvailableVehicles();

            // Assert
            expect(result).toEqual(mockVehicles);
            expect(findAvailableVehiclesUseCase.execute).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no vehicles are available', async () => {
            // Arrange
            findAvailableVehiclesUseCase.execute.mockResolvedValue([]);

            // Act
            const result = await controller.listAvailableVehicles();

            // Assert
            expect(result).toEqual([]);
        });
    });

    describe('listSoldVehicles', () => {
        it('should return formatted sold vehicles', async () => {
            // Arrange
            const mockSoldVehicles: SoldVehicle[] = [
                {
                    vehicle: new VehicleEntity({
                        id: '1',
                        brand: 'Honda',
                        model: 'Civic',
                        year: 2024,
                        color: 'Black',
                        price: 28000,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }),
                    saleInfo: {
                        saleDate: new Date('2024-01-15'),
                        totalPrice: 28000,
                        customerName: 'John Doe',
                        customerEmail: 'john@example.com',
                    },
                },
            ];
            findSoldVehiclesUseCase.execute.mockResolvedValue(mockSoldVehicles);

            // Act
            const result = await controller.listSoldVehicles();

            // Assert
            expect(result).toEqual(mockSoldVehicles);
            expect(findSoldVehiclesUseCase.execute).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no vehicles are sold', async () => {
            // Arrange
            findSoldVehiclesUseCase.execute.mockResolvedValue([]);

            // Act
            const result = await controller.listSoldVehicles();

            // Assert
            expect(result).toEqual([]);
        });
    });
});
