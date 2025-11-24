import { AvailableVehiclesPresenter } from './available-vehicles.presenter';
import { VehicleEntity } from '@/modules/vehicle_read/domain/entities/vehicle.entity';
import { VehicleOutputDTO } from '../../application/dtos/vehicle.dto';

describe('AvailableVehiclesPresenter', () => {
    describe('present', () => {
        it('should transform available vehicle entities to DTOs', () => {
            const vehicles: VehicleEntity[] = [
                new VehicleEntity({
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2024,
                    color: 'Silver',
                    price: 85000,
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-02'),
                }),
            ];

            const result: VehicleOutputDTO[] = AvailableVehiclesPresenter.present(vehicles);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: '1',
                brand: 'Toyota',
                model: 'Corolla',
                year: 2024,
                color: 'Silver',
                price: 85000,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });

        it('should handle multiple available vehicles', () => {
            const vehicles: VehicleEntity[] = [
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

            const result = AvailableVehiclesPresenter.present(vehicles);

            expect(result).toHaveLength(2);
        });

        it('should handle empty array', () => {
            const result = AvailableVehiclesPresenter.present([]);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should map all fields correctly', () => {
            const vehicle = new VehicleEntity({
                id: 'test-id',
                brand: 'Ford',
                model: 'Focus',
                year: 2022,
                color: 'Blue',
                price: 75000,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-20'),
            });

            const result = AvailableVehiclesPresenter.present([vehicle]);

            expect(result[0].id).toBe('test-id');
            expect(result[0].brand).toBe('Ford');
            expect(result[0].model).toBe('Focus');
            expect(result[0].year).toBe(2022);
            expect(result[0].color).toBe('Blue');
            expect(result[0].price).toBe(75000);
        });
    });
});
