import { FindSoldVehiclesUseCase } from './find-sold-vehicles.usecase';
import { VehicleRepositoryInterface, SoldVehicle } from '@/modules/vehicle_read/domain/repositories/vehicle-repository.interface';
import { VehicleEntity } from '@/modules/vehicle_read/domain/entities/vehicle.entity';

describe('FindSoldVehiclesUseCase', () => {
    let useCase: FindSoldVehiclesUseCase;
    let mockRepository: jest.Mocked<VehicleRepositoryInterface>;

    beforeEach(() => {
        mockRepository = {
            getAllVehicles: jest.fn(),
            getAvailableVehicles: jest.fn(),
            getSoldVehicles: jest.fn(),
        };
        useCase = new FindSoldVehiclesUseCase(mockRepository);
    });

    it('should return sold vehicles with sale info from repository', async () => {
        const mockSoldVehicles: SoldVehicle[] = [
            {
                vehicle: new VehicleEntity({
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2024,
                    color: 'Silver',
                    price: 85000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
                saleInfo: {
                    saleDate: new Date('2024-01-15'),
                    totalPrice: 85000,
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                },
            },
        ];

        mockRepository.getSoldVehicles.mockResolvedValue(mockSoldVehicles);

        const result = await useCase.execute();

        expect(result).toEqual(mockSoldVehicles);
        expect(mockRepository.getSoldVehicles).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no sold vehicles exist', async () => {
        mockRepository.getSoldVehicles.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toEqual([]);
        expect(mockRepository.getSoldVehicles).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
        const error = new Error('Failed to fetch sold vehicles');
        mockRepository.getSoldVehicles.mockRejectedValue(error);

        await expect(useCase.execute()).rejects.toThrow('Failed to fetch sold vehicles');
        expect(mockRepository.getSoldVehicles).toHaveBeenCalledTimes(1);
    });
});
