import { SoldVehiclesPresenter } from './sold-vehicles.presenter';
import { SoldVehicle } from '@/modules/vehicle_sale/domain/repositories/vehicle-repository.interface';
import { VehicleEntity } from '@/modules/vehicle_sale/domain/entities/vehicle.entity';

describe('SoldVehiclesPresenter', () => {
    describe('present', () => {
        it('should format sold vehicles to view model', () => {
            // Arrange
            const soldVehicles: SoldVehicle[] = [
                {
                    vehicle: new VehicleEntity({
                        id: '1',
                        brand: 'Toyota',
                        model: 'Corolla',
                        year: 2023,
                        color: 'White',
                        price: 25000,
                        createdAt: new Date('2024-01-01'),
                        updatedAt: new Date('2024-01-02'),
                    }),
                    saleInfo: {
                        saleDate: new Date('2024-01-15'),
                        totalPrice: 25000,
                        customerName: 'John Doe',
                        customerEmail: 'john@example.com',
                    },
                },
            ];

            // Act
            const result = SoldVehiclesPresenter.present(soldVehicles);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                vehicle: {
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2023,
                    color: 'White',
                    price: 25000,
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-02'),
                },
                saleInfo: {
                    saleDate: new Date('2024-01-15'),
                    totalPrice: 25000,
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                },
            });
        });

        it('should return empty array for empty input', () => {
            // Act
            const result = SoldVehiclesPresenter.present([]);

            // Assert
            expect(result).toEqual([]);
        });
    });
});
