import { AvailableVehiclesPresenter } from './available-vehicles.presenter';
import { VehicleEntity } from '@/modules/vehicle_sale/domain/entities/vehicle.entity';

describe('AvailableVehiclesPresenter', () => {
    describe('present', () => {
        it('should format vehicles to view model', () => {
            // Arrange
            const vehicles: VehicleEntity[] = [
                new VehicleEntity({
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2023,
                    color: 'White',
                    price: 25000,
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-02'),
                }),
                new VehicleEntity({
                    id: '2',
                    brand: 'Honda',
                    model: 'Civic',
                    year: 2024,
                    color: 'Black',
                    price: 28000,
                    createdAt: new Date('2024-01-03'),
                    updatedAt: new Date('2024-01-04'),
                }),
            ];

            // Act
            const result = AvailableVehiclesPresenter.present(vehicles);

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                id: '1',
                brand: 'Toyota',
                model: 'Corolla',
                year: 2023,
                color: 'White',
                price: 25000,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
            });
        });

        it('should return empty array for empty input', () => {
            // Act
            const result = AvailableVehiclesPresenter.present([]);

            // Assert
            expect(result).toEqual([]);
        });
    });
});
