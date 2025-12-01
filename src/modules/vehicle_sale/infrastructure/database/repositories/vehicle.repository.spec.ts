import { PrismaVehicleRepository } from './vehicle.repository';
import prisma from '@/core/infrastructure/database/prisma.client';
import { VehicleEntity } from '@/modules/vehicle_sale/domain/entities/vehicle.entity';

jest.mock('@/core/infrastructure/database/prisma.client', () => ({
    __esModule: true,
    default: {
        vehicle: {
            findMany: jest.fn(),
        },
        sale: {
            findMany: jest.fn(),
        },
    },
}));

describe('PrismaVehicleRepository', () => {
    let repository: PrismaVehicleRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new PrismaVehicleRepository();
    });

    describe('getAllVehicles', () => {
        it('should return all vehicles', async () => {
            // Arrange
            const mockVehicles = [
                {
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2023,
                    color: 'White',
                    price: 25000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            (prisma.vehicle.findMany as jest.Mock).mockResolvedValue(mockVehicles);

            // Act
            const result = await repository.getAllVehicles();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(VehicleEntity);
            expect(result[0].brand).toBe('Toyota');
            expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
            });
        });
    });

    describe('getAvailableVehicles', () => {
        it('should return vehicles without sales', async () => {
            // Arrange
            const mockVehicles = [
                {
                    id: '1',
                    brand: 'Honda',
                    model: 'Civic',
                    year: 2024,
                    color: 'Black',
                    price: 28000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            (prisma.vehicle.findMany as jest.Mock).mockResolvedValue(mockVehicles);

            // Act
            const result = await repository.getAvailableVehicles();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(VehicleEntity);
            expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
                where: { sales: { none: {} } },
                orderBy: { price: 'asc' },
            });
        });
    });

    describe('getSoldVehicles', () => {
        it('should return sold vehicles with sale info', async () => {
            // Arrange
            const mockSales = [
                {
                    id: 'sale-1',
                    vehicleId: 'vehicle-1',
                    customerId: 'customer-1',
                    saleDate: new Date('2024-01-15'),
                    totalPrice: 25000,
                    vehicle: {
                        id: 'vehicle-1',
                        brand: 'Toyota',
                        model: 'Corolla',
                        year: 2023,
                        color: 'White',
                        price: 25000,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    customer: {
                        id: 'customer-1',
                        name: 'John Doe',
                        email: 'john@example.com',
                    },
                },
            ];
            (prisma.sale.findMany as jest.Mock).mockResolvedValue(mockSales);

            // Act
            const result = await repository.getSoldVehicles();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].vehicle).toBeInstanceOf(VehicleEntity);
            expect(result[0].saleInfo.customerName).toBe('John Doe');
            expect(prisma.sale.findMany).toHaveBeenCalledWith({
                include: { vehicle: true, customer: true },
                orderBy: { saleDate: 'desc' },
            });
        });
    });
});
