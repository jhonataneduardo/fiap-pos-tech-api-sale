import { VehicleMapper } from './vehicle.mapper';
import { Vehicle } from '@prisma/client';
import { VehicleEntity } from '@/modules/vehicle_read/domain/entities/vehicle.entity';

describe('VehicleMapper', () => {
    describe('toEntity', () => {
        it('should convert Prisma model to VehicleEntity correctly', () => {
            const prismaVehicle: Vehicle = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                brand: 'Toyota',
                model: 'Corolla',
                year: 2024,
                color: 'Silver',
                price: 85000,
                createdAt: new Date('2024-01-01T00:00:00.000Z'),
                updatedAt: new Date('2024-01-02T00:00:00.000Z'),
            };

            const entity = VehicleMapper.toEntity(prismaVehicle);

            expect(entity).toBeInstanceOf(VehicleEntity);
            expect(entity.id).toBe(prismaVehicle.id);
            expect(entity.brand).toBe(prismaVehicle.brand);
            expect(entity.model).toBe(prismaVehicle.model);
            expect(entity.year).toBe(prismaVehicle.year);
            expect(entity.color).toBe(prismaVehicle.color);
            expect(entity.price).toBe(prismaVehicle.price);
            expect(entity.createdAt).toEqual(prismaVehicle.createdAt);
            expect(entity.updatedAt).toEqual(prismaVehicle.updatedAt);
        });

        it('should handle different vehicle data', () => {
            const prismaVehicle: Vehicle = {
                id: '987e6543-e21b-43d2-b654-321654987000',
                brand: 'Honda',
                model: 'Civic',
                year: 2023,
                color: 'Black',
                price: 95000,
                createdAt: new Date('2024-02-01T10:30:00.000Z'),
                updatedAt: new Date('2024-02-15T14:45:00.000Z'),
            };

            const entity = VehicleMapper.toEntity(prismaVehicle);

            expect(entity.brand).toBe('Honda');
            expect(entity.model).toBe('Civic');
            expect(entity.year).toBe(2023);
            expect(entity.color).toBe('Black');
            expect(entity.price).toBe(95000);
        });

        it('should preserve date objects correctly', () => {
            const createdDate = new Date('2024-01-01T12:00:00.000Z');
            const updatedDate = new Date('2024-01-05T18:30:00.000Z');

            const prismaVehicle: Vehicle = {
                id: 'test-id',
                brand: 'Ford',
                model: 'Focus',
                year: 2022,
                color: 'Blue',
                price: 75000,
                createdAt: createdDate,
                updatedAt: updatedDate,
            };

            const entity = VehicleMapper.toEntity(prismaVehicle);

            expect(entity.createdAt).toBe(createdDate);
            expect(entity.updatedAt).toBe(updatedDate);
            expect(entity.createdAt.getTime()).toBe(createdDate.getTime());
            expect(entity.updatedAt.getTime()).toBe(updatedDate.getTime());
        });
    });
});
