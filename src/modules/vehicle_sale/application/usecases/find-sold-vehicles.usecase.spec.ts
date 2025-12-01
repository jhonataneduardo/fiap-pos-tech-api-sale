import { FindSoldVehiclesUseCase } from './find-sold-vehicles.usecase';
import { VehicleRepositoryInterface, SoldVehicle } from '@/modules/vehicle_sale/domain/repositories/vehicle-repository.interface';
import { VehicleEntity } from '@/modules/vehicle_sale/domain/entities/vehicle.entity';

describe('FindSoldVehiclesUseCase', () => {
    let useCase: FindSoldVehiclesUseCase;
    let vehicleRepository: jest.Mocked<VehicleRepositoryInterface>;

    beforeEach(() => {
        vehicleRepository = {
            getAllVehicles: jest.fn(),
            getAvailableVehicles: jest.fn(),
            getSoldVehicles: jest.fn(),
        };
        useCase = new FindSoldVehiclesUseCase(vehicleRepository);
    });

    describe('execute', () => {
        it('should return sold vehicles with sale information', async () => {
            // Arrange
            const mockSoldVehicles: SoldVehicle[] = [
                {
                    vehicle: new VehicleEntity({
                        id: '1',
                        brand: 'Toyota',
                        model: 'Corolla',
                        year: 2023,
                        color: 'White',
                        price: 25000,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }),
                    saleInfo: {
                        saleDate: new Date('2024-01-15'),
                        totalPrice: 25000,
                        customerName: 'John Doe',
                        customerEmail: 'john@example.com',
                    },
                },
                {
                    vehicle: new VehicleEntity({
                        id: '2',
                        brand: 'Honda',
                        model: 'Civic',
                        year: 2024,
                        color: 'Black',
                        price: 28000,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }),
                    saleInfo: {
                        saleDate: new Date('2024-02-20'),
                        totalPrice: 28000,
                        customerName: 'Jane Smith',
                        customerEmail: 'jane@example.com',
                    },
                },
            ];
            vehicleRepository.getSoldVehicles.mockResolvedValue(mockSoldVehicles);

            // Act
            const result = await useCase.execute();

            // Assert
            expect(result).toEqual(mockSoldVehicles);
            expect(result).toHaveLength(2);
            expect(result[0].vehicle.brand).toBe('Toyota');
            expect(result[0].saleInfo.customerName).toBe('John Doe');
            expect(vehicleRepository.getSoldVehicles).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no vehicles are sold', async () => {
            // Arrange
            vehicleRepository.getSoldVehicles.mockResolvedValue([]);

            // Act
            const result = await useCase.execute();

            // Assert
            expect(result).toEqual([]);
            expect(vehicleRepository.getSoldVehicles).toHaveBeenCalledTimes(1);
        });

        it('should propagate repository errors', async () => {
            // Arrange
            const error = new Error('Database query failed');
            vehicleRepository.getSoldVehicles.mockRejectedValue(error);

            // Act & Assert
            await expect(useCase.execute()).rejects.toThrow('Database query failed');
            expect(vehicleRepository.getSoldVehicles).toHaveBeenCalledTimes(1);
        });
    });
});
