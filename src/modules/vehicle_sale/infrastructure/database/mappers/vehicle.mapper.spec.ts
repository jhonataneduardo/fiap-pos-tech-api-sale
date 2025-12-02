import { VehicleMapper } from './vehicle.mapper';
import { Vehicle } from '@prisma/client';
import { VehicleEntity } from '@/modules/vehicle_sale/domain/entities/vehicle.entity';

describe('VehicleMapper', () => {
    describe('toEntity', () => {
        it('should convert Prisma Vehicle to VehicleEntity', () => {
            // Arrange
            const prismaVehicle: Vehicle = {
                id: '1',
                brand: 'Toyota',
                model: 'Corolla',
                year: 2023,
                color: 'White',
                price: 25000,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
            };

            // Act
            const result = VehicleMapper.toEntity(prismaVehicle);

            // Assert
            expect(result).toBeInstanceOf(VehicleEntity);
            expect(result.id).toBe('1');
            expect(result.brand).toBe('Toyota');
            expect(result.model).toBe('Corolla');
            expect(result.year).toBe(2023);
            expect(result.color).toBe('White');
            expect(result.price).toBe(25000);
            expect(result.createdAt).toEqual(new Date('2024-01-01'));
            expect(result.updatedAt).toEqual(new Date('2024-01-02'));
        });
    });
});
