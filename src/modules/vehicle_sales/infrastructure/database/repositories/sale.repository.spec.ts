import { PrismaSaleRepository } from './sale.repository';
import prisma from '@/core/infrastructure/database/prisma.client';
import { SaleEntity } from '@/modules/vehicle_sales/domain/entities/sale.entity';
import { SaleStatus } from '@/modules/vehicle_sales/domain/entities/enums';

jest.mock('@/core/infrastructure/database/prisma.client', () => ({
    __esModule: true,
    default: {
        sale: {
            create: jest.fn(),
            findUniqueOrThrow: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe('PrismaSaleRepository', () => {
    let repository: PrismaSaleRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new PrismaSaleRepository();
    });

    describe('createSale', () => {
        it('should create a new sale', async () => {
            // Arrange
            const saleEntity = new SaleEntity({
                id: 'sale-123',
                vehicleId: 'vehicle-123',
                customerId: 'customer-123',
                saleDate: new Date('2024-01-15'),
                paymentCode: 'PAY-12345678',
                totalPrice: 25000,
                status: SaleStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const mockPrismaSale = {
                id: 'sale-123',
                vehicleId: 'vehicle-123',
                customerId: 'customer-123',
                saleDate: new Date('2024-01-15'),
                paymentCode: 'PAY-12345678',
                totalPrice: 25000,
                status: 'PENDING',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.sale.create as jest.Mock).mockResolvedValue(mockPrismaSale);

            // Act
            const result = await repository.createSale(saleEntity);

            // Assert
            expect(result).toBeInstanceOf(SaleEntity);
            expect(result.id).toBe('sale-123');
            expect(prisma.sale.create).toHaveBeenCalled();
        });
    });

    describe('getSaleById', () => {
        it('should return a sale by id', async () => {
            // Arrange
            const mockSale = {
                id: 'sale-123',
                vehicleId: 'vehicle-123',
                customerId: 'customer-123',
                saleDate: new Date(),
                paymentCode: 'PAY-12345678',
                totalPrice: 25000,
                status: 'PENDING',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.sale.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockSale);

            // Act
            const result = await repository.getSaleById('sale-123');

            // Assert
            expect(result).toBeInstanceOf(SaleEntity);
            expect(result.id).toBe('sale-123');
            expect(prisma.sale.findUniqueOrThrow).toHaveBeenCalledWith({
                where: { id: 'sale-123' },
            });
        });
    });

    describe('getSaleByPaymentCode', () => {
        it('should return a sale by payment code', async () => {
            // Arrange
            const mockSale = {
                id: 'sale-123',
                vehicleId: 'vehicle-123',
                customerId: 'customer-123',
                saleDate: new Date(),
                paymentCode: 'PAY-12345678',
                totalPrice: 25000,
                status: 'PENDING',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.sale.findUnique as jest.Mock).mockResolvedValue(mockSale);

            // Act
            const result = await repository.getSaleByPaymentCode('PAY-12345678');

            // Assert
            expect(result).toBeInstanceOf(SaleEntity);
            expect(result?.paymentCode).toBe('PAY-12345678');
        });

        it('should return null when sale not found', async () => {
            // Arrange
            (prisma.sale.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const result = await repository.getSaleByPaymentCode('INVALID');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('updateSaleStatus', () => {
        it('should update sale status', async () => {
            // Arrange
            const mockUpdatedSale = {
                id: 'sale-123',
                vehicleId: 'vehicle-123',
                customerId: 'customer-123',
                saleDate: new Date(),
                paymentCode: 'PAY-12345678',
                totalPrice: 25000,
                status: 'PAID',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.sale.update as jest.Mock).mockResolvedValue(mockUpdatedSale);

            // Act
            const result = await repository.updateSaleStatus('PAY-12345678', SaleStatus.PAID);

            // Assert
            expect(result).toBeInstanceOf(SaleEntity);
            expect(result.status).toBe(SaleStatus.PAID);
            expect(prisma.sale.update).toHaveBeenCalledWith({
                where: { paymentCode: 'PAY-12345678' },
                data: expect.objectContaining({
                    status: SaleStatus.PAID,
                }),
            });
        });
    });

    describe('updateSale', () => {
        it('should update a sale', async () => {
            // Arrange
            const saleEntity = new SaleEntity({
                id: 'sale-123',
                vehicleId: 'vehicle-456',
                customerId: 'customer-789',
                saleDate: new Date('2024-01-15'),
                paymentCode: 'PAY-87654321',
                totalPrice: 30000,
                status: SaleStatus.PAID,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const mockUpdatedSale = {
                id: 'sale-123',
                vehicleId: 'vehicle-456',
                customerId: 'customer-789',
                saleDate: new Date('2024-01-15'),
                paymentCode: 'PAY-87654321',
                totalPrice: 30000,
                status: 'PAID',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.sale.update as jest.Mock).mockResolvedValue(mockUpdatedSale);

            // Act
            const result = await repository.updateSale('sale-123', saleEntity);

            // Assert
            expect(result).toBeInstanceOf(SaleEntity);
            expect(result.totalPrice).toBe(30000);
            expect(prisma.sale.update).toHaveBeenCalled();
        });
    });

    describe('getSalesWithVehicles', () => {
        it('should return sales with vehicle data', async () => {
            // Arrange
            const mockSalesWithVehicles = [
                {
                    id: 'sale-123',
                    vehicleId: 'vehicle-123',
                    customerId: 'customer-123',
                    saleDate: new Date(),
                    paymentCode: 'PAY-12345678',
                    totalPrice: 25000,
                    status: 'PENDING',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    vehicle: {
                        id: 'vehicle-123',
                        brand: 'Toyota',
                        model: 'Corolla',
                        year: 2023,
                        color: 'White',
                        price: 25000,
                    },
                },
            ];

            (prisma.sale.findMany as jest.Mock).mockResolvedValue(mockSalesWithVehicles);

            // Act
            const result = await repository.getSalesWithVehicles();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].sale).toBeInstanceOf(SaleEntity);
            expect(result[0].vehicle.brand).toBe('Toyota');
        });
    });
});
