import { SoldVehiclesPresenter } from './sold-vehicles.presenter';
import { SoldVehicle } from '@/modules/vehicle_read/domain/repositories/vehicle-repository.interface';
import { VehicleEntity } from '@/modules/vehicle_read/domain/entities/vehicle.entity';
import { SoldVehicleOutputDTO } from '../../application/dtos/vehicle.dto';

describe('SoldVehiclesPresenter', () => {
    describe('present', () => {
        it('should transform sold vehicles to DTOs with sale info', () => {
            const soldVehicles: SoldVehicle[] = [
                {
                    vehicle: new VehicleEntity({
                        id: '1',
                        brand: 'Toyota',
                        model: 'Corolla',
                        year: 2024,
                        color: 'Silver',
                        price: 85000,
                        createdAt: new Date('2024-01-01'),
                        updatedAt: new Date('2024-01-02'),
                    }),
                    saleInfo: {
                        saleDate: new Date('2024-01-15'),
                        totalPrice: 85000,
                        customerName: 'John Doe',
                        customerEmail: 'john@example.com',
                    },
                },
            ];

            const result: SoldVehicleOutputDTO[] = SoldVehiclesPresenter.present(soldVehicles);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                vehicle: {
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2024,
                    color: 'Silver',
                    price: 85000,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                },
                saleInfo: {
                    saleDate: expect.any(Date),
                    totalPrice: 85000,
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                },
            });
        });

        it('should handle multiple sold vehicles', () => {
            const soldVehicles: SoldVehicle[] = [
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
                {
                    vehicle: new VehicleEntity({
                        id: '2',
                        brand: 'Honda',
                        model: 'Civic',
                        year: 2023,
                        color: 'Black',
                        price: 95000,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }),
                    saleInfo: {
                        saleDate: new Date('2024-01-20'),
                        totalPrice: 95000,
                        customerName: 'Jane Smith',
                        customerEmail: 'jane@example.com',
                    },
                },
            ];

            const result = SoldVehiclesPresenter.present(soldVehicles);

            expect(result).toHaveLength(2);
            expect(result[1].vehicle.brand).toBe('Honda');
            expect(result[1].saleInfo.customerName).toBe('Jane Smith');
        });

        it('should handle empty array', () => {
            const result = SoldVehiclesPresenter.present([]);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should map all vehicle fields correctly', () => {
            const soldVehicle: SoldVehicle = {
                vehicle: new VehicleEntity({
                    id: 'test-id',
                    brand: 'Ford',
                    model: 'Focus',
                    year: 2022,
                    color: 'Blue',
                    price: 75000,
                    createdAt: new Date('2024-01-15'),
                    updatedAt: new Date('2024-01-20'),
                }),
                saleInfo: {
                    saleDate: new Date('2024-02-01'),
                    totalPrice: 75000,
                    customerName: 'Test Customer',
                    customerEmail: 'test@example.com',
                },
            };

            const result = SoldVehiclesPresenter.present([soldVehicle]);

            expect(result[0].vehicle.id).toBe('test-id');
            expect(result[0].vehicle.brand).toBe('Ford');
            expect(result[0].vehicle.model).toBe('Focus');
            expect(result[0].saleInfo.customerEmail).toBe('test@example.com');
        });

        it('should preserve date values in sale info', () => {
            const saleDate = new Date('2024-01-15T10:30:00.000Z');

            const soldVehicle: SoldVehicle = {
                vehicle: new VehicleEntity({
                    id: '1',
                    brand: 'Test',
                    model: 'Model',
                    year: 2024,
                    color: 'Red',
                    price: 50000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
                saleInfo: {
                    saleDate,
                    totalPrice: 50000,
                    customerName: 'Test',
                    customerEmail: 'test@example.com',
                },
            };

            const result = SoldVehiclesPresenter.present([soldVehicle]);

            expect(result[0].saleInfo.saleDate).toEqual(saleDate);
        });
    });
});
