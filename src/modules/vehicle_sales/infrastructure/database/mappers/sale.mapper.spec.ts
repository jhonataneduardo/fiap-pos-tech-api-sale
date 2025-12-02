import { SaleMapper } from './sale.mapper';
import { Sale } from '@prisma/client';
import { SaleEntity } from '@/modules/vehicle_sales/domain/entities/sale.entity';
import { SaleStatus } from '@/modules/vehicle_sales/domain/entities/enums';

describe('SaleMapper', () => {
    describe('toEntity', () => {
        it('should convert Prisma Sale to SaleEntity', () => {
            // Arrange
            const prismaSale: Sale = {
                id: 'sale-123',
                vehicleId: 'vehicle-123',
                customerId: 'customer-123',
                saleDate: new Date('2024-01-15'),
                paymentCode: 'PAY-12345678',
                totalPrice: 25000,
                status: 'PENDING',
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15'),
            };

            // Act
            const result = SaleMapper.toEntity(prismaSale);

            // Assert
            expect(result).toBeInstanceOf(SaleEntity);
            expect(result.id).toBe('sale-123');
            expect(result.vehicleId).toBe('vehicle-123');
            expect(result.customerId).toBe('customer-123');
            expect(result.saleDate).toEqual(new Date('2024-01-15'));
            expect(result.paymentCode).toBe('PAY-12345678');
            expect(result.totalPrice).toBe(25000);
            expect(result.status).toBe(SaleStatus.PENDING);
            expect(result.createdAt).toEqual(new Date('2024-01-15'));
            expect(result.updatedAt).toEqual(new Date('2024-01-15'));
        });
    });

    describe('toPersistence', () => {
        it('should convert SaleEntity to persistence data', () => {
            // Arrange
            const saleEntity = new SaleEntity({
                id: 'sale-123',
                vehicleId: 'vehicle-123',
                customerId: 'customer-123',
                saleDate: new Date('2024-01-15'),
                paymentCode: 'PAY-12345678',
                totalPrice: 25000,
                status: SaleStatus.PENDING,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15'),
            });

            // Act
            const result = SaleMapper.toPersistence(saleEntity);

            // Assert
            expect(result).toEqual({
                id: 'sale-123',
                vehicleId: 'vehicle-123',
                customerId: 'customer-123',
                saleDate: new Date('2024-01-15'),
                paymentCode: 'PAY-12345678',
                totalPrice: 25000,
                status: SaleStatus.PENDING,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15'),
            });
        });
    });
});
