import { ListAllVehiclesUseCase } from './list-all-vehicles.usecase';
import { VehicleRepositoryInterface } from '@/modules/vehicle_read/domain/repositories/vehicle-repository.interface';
import { VehicleEntity } from '@/modules/vehicle_read/domain/entities/vehicle.entity';

describe('ListAllVehiclesUseCase', () => {
    let useCase: ListAllVehiclesUseCase;
    let mockRepository: jest.Mocked<VehicleRepositoryInterface>;

    beforeEach(() => {
        mockRepository = {
            getAllVehicles: jest.fn(),
            getAvailableVehicles: jest.fn(),
            getSoldVehicles: jest.fn(),
        };
        useCase = new ListAllVehiclesUseCase(mockRepository);
    });

    it('should return all vehicles from repository', async () => {
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

        mockRepository.getAllVehicles.mockResolvedValue(mockVehicles);

        const result = await useCase.execute();

        expect(result).toEqual(mockVehicles);
        expect(mockRepository.getAllVehicles).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no vehicles exist', async () => {
        mockRepository.getAllVehicles.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toEqual([]);
        expect(mockRepository.getAllVehicles).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        mockRepository.getAllVehicles.mockRejectedValue(error);

        await expect(useCase.execute()).rejects.toThrow('Database connection failed');
        expect(mockRepository.getAllVehicles).toHaveBeenCalledTimes(1);
    });
});
