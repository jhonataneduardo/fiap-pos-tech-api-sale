import { ListVehiclesPresenter } from './list-vehicles.presenter';
import { VehicleEntity } from '@/modules/vehicle_read/domain/entities/vehicle.entity';
import { VehicleOutputDTO } from '../../application/dtos/vehicle.dto';

describe('ListVehiclesPresenter', () => {
    describe('present', () => {
        it('should transform vehicle entities to DTOs', () => {
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
                new VehicleEntity({
                    id: '2',
                    brand: 'Honda',
                    model: 'Civic',
                    year: 2023,
                    color: 'Black',
                    price: 95000,
                    createdAt: new Date('2024-02-01'),
                    updatedAt: new Date('2024-02-02'),
                }),
            ];

            const result: VehicleOutputDTO[] = ListVehiclesPresenter.present(vehicles);

            expect(result).toHaveLength(2);
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
            expect(result[1]).toEqual({
                id: '2',
                brand: 'Honda',
                model: 'Civic',
                year: 2023,
                color: 'Black',
                price: 95000,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
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

            const result = ListVehiclesPresenter.present([vehicle]);

            expect(result[0].id).toBe('test-id');
            expect(result[0].brand).toBe('Ford');
            expect(result[0].model).toBe('Focus');
            expect(result[0].year).toBe(2022);
            expect(result[0].color).toBe('Blue');
            expect(result[0].price).toBe(75000);
        });

        it('should handle empty array', () => {
            const result = ListVehiclesPresenter.present([]);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should preserve date values', () => {
            const createdAt = new Date('2024-01-01T10:00:00.000Z');
            const updatedAt = new Date('2024-01-05T15:30:00.000Z');

            const vehicle = new VehicleEntity({
                id: 'test-id',
                brand: 'Test',
                model: 'Model',
                year: 2024,
                color: 'Red',
                price: 50000,
                createdAt,
                updatedAt,
            });

            const result = ListVehiclesPresenter.present([vehicle]);

            expect(result[0].createdAt).toEqual(createdAt);
            expect(result[0].updatedAt).toEqual(updatedAt);
        });
    });
});
