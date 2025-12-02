import { FindAvailableVehiclesUseCase } from './find-available-vehicles.usecase';
import { VehicleRepositoryInterface } from '@/modules/vehicle_sale/domain/repositories/vehicle-repository.interface';
import { VehicleEntity } from '@/modules/vehicle_sale/domain/entities/vehicle.entity';

describe('FindAvailableVehiclesUseCase', () => {
    let useCase: FindAvailableVehiclesUseCase;
    let vehicleRepository: jest.Mocked<VehicleRepositoryInterface>;

    beforeEach(() => {
        vehicleRepository = {
            getAllVehicles: jest.fn(),
            getAvailableVehicles: jest.fn(),
            getSoldVehicles: jest.fn(),
        };
        useCase = new FindAvailableVehiclesUseCase(vehicleRepository);
    });

    describe('execute', () => {
        it('should return available vehicles from repository', async () => {
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
                new VehicleEntity({
                    id: '2',
                    brand: 'Honda',
                    model: 'Civic',
                    year: 2024,
                    color: 'Black',
                    price: 28000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];
            vehicleRepository.getAvailableVehicles.mockResolvedValue(mockVehicles);

            // Act
            const result = await useCase.execute();

            // Assert
            expect(result).toEqual(mockVehicles);
            expect(vehicleRepository.getAvailableVehicles).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no vehicles are available', async () => {
            // Arrange
            vehicleRepository.getAvailableVehicles.mockResolvedValue([]);

            // Act
            const result = await useCase.execute();

            // Assert
            expect(result).toEqual([]);
            expect(vehicleRepository.getAvailableVehicles).toHaveBeenCalledTimes(1);
        });

        it('should propagate repository errors', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            vehicleRepository.getAvailableVehicles.mockRejectedValue(error);

            // Act & Assert
            await expect(useCase.execute()).rejects.toThrow('Database connection failed');
            expect(vehicleRepository.getAvailableVehicles).toHaveBeenCalledTimes(1);
        });
    });
});
