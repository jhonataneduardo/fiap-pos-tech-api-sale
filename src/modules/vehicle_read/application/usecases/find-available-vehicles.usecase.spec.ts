import { FindAvailableVehiclesUseCase } from './find-available-vehicles.usecase';
import { VehicleRepositoryInterface } from '@/modules/vehicle_read/domain/repositories/vehicle-repository.interface';
import { VehicleEntity } from '@/modules/vehicle_read/domain/entities/vehicle.entity';

describe('FindAvailableVehiclesUseCase', () => {
    let useCase: FindAvailableVehiclesUseCase;
    let mockRepository: jest.Mocked<VehicleRepositoryInterface>;

    beforeEach(() => {
        mockRepository = {
            getAllVehicles: jest.fn(),
            getAvailableVehicles: jest.fn(),
            getSoldVehicles: jest.fn(),
        };
        useCase = new FindAvailableVehiclesUseCase(mockRepository);
    });

    it('should return available vehicles from repository', async () => {
        const mockAvailableVehicles: VehicleEntity[] = [
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

        mockRepository.getAvailableVehicles.mockResolvedValue(mockAvailableVehicles);

        const result = await useCase.execute();

        expect(result).toEqual(mockAvailableVehicles);
        expect(mockRepository.getAvailableVehicles).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no available vehicles exist', async () => {
        mockRepository.getAvailableVehicles.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toEqual([]);
        expect(mockRepository.getAvailableVehicles).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
        const error = new Error('Database query failed');
        mockRepository.getAvailableVehicles.mockRejectedValue(error);

        await expect(useCase.execute()).rejects.toThrow('Database query failed');
        expect(mockRepository.getAvailableVehicles).toHaveBeenCalledTimes(1);
    });
});
