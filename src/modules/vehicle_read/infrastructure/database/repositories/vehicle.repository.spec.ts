import { PrismaVehicleRepository } from './vehicle.repository';
import { PrismaClient } from '@prisma/client';
import { VehicleMapper } from '../mappers/vehicle.mapper';
import { VehicleEntity } from '@/modules/vehicle_read/domain/entities/vehicle.entity';

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

jest.mock('../mappers/vehicle.mapper');

describe('PrismaVehicleRepository', () => {
    let repository: PrismaVehicleRepository;
    let mockPrisma: any;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new PrismaVehicleRepository();
        mockPrisma = require('@/core/infrastructure/database/prisma.client').default;
    });

    describe('getAllVehicles', () => {
        it('should return all vehicles ordered by createdAt desc', async () => {
            const mockPrismaVehicles = [
                {
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2024,
                    color: 'Silver',
                    price: 85000,
                    createdAt: new Date('2024-01-02'),
                    updatedAt: new Date('2024-01-02'),
                },
                {
                    id: '2',
                    brand: 'Honda',
                    model: 'Civic',
                    year: 2023,
                    color: 'Black',
                    price: 95000,
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-01'),
                },
            ];

            const mockVehicleEntities = mockPrismaVehicles.map(v => new VehicleEntity(v));

            mockPrisma.vehicle.findMany.mockResolvedValue(mockPrismaVehicles);
            (VehicleMapper.toEntity as jest.Mock).mockImplementation((v: any) => new VehicleEntity(v));

            const result = await repository.getAllVehicles();

            expect(mockPrisma.vehicle.findMany).toHaveBeenCalledWith({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            expect(VehicleMapper.toEntity).toHaveBeenCalledTimes(2);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no vehicles exist', async () => {
            mockPrisma.vehicle.findMany.mockResolvedValue([]);

            const result = await repository.getAllVehicles();

            expect(result).toEqual([]);
        });

        it('should propagate Prisma errors', async () => {
            const error = new Error('Database error');
            mockPrisma.vehicle.findMany.mockRejectedValue(error);

            await expect(repository.getAllVehicles()).rejects.toThrow('Database error');
        });
    });

    describe('getAvailableVehicles', () => {
        it('should return vehicles with no sales ordered by price asc', async () => {
            const mockAvailableVehicles = [
                {
                    id: '1',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2024,
                    color: 'Silver',
                    price: 85000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockPrisma.vehicle.findMany.mockResolvedValue(mockAvailableVehicles);
            (VehicleMapper.toEntity as jest.Mock).mockImplementation((v: any) => new VehicleEntity(v));

            const result = await repository.getAvailableVehicles();

            expect(mockPrisma.vehicle.findMany).toHaveBeenCalledWith({
                where: {
                    sales: {
                        none: {},
                    },
                },
                orderBy: {
                    price: 'asc',
                },
            });
            expect(result).toHaveLength(1);
        });

        it('should return empty array when no available vehicles', async () => {
            mockPrisma.vehicle.findMany.mockResolvedValue([]);

            const result = await repository.getAvailableVehicles();

            expect(result).toEqual([]);
        });
    });

    describe('getSoldVehicles', () => {
        it('should return sold vehicles with sale info ordered by saleDate desc', async () => {
            const mockSales = [
                {
                    id: 'sale-1',
                    saleDate: new Date('2024-01-15'),
                    totalPrice: 85000,
                    vehicle: {
                        id: '1',
                        brand: 'Toyota',
                        model: 'Corolla',
                        year: 2024,
                        color: 'Silver',
                        price: 85000,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    customer: {
                        name: 'John Doe',
                        email: 'john@example.com',
                    },
                },
            ];

            mockPrisma.sale.findMany.mockResolvedValue(mockSales);
            (VehicleMapper.toEntity as jest.Mock).mockImplementation((v: any) => new VehicleEntity(v));

            const result = await repository.getSoldVehicles();

            expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
                include: {
                    vehicle: true,
                    customer: true,
                },
                orderBy: {
                    saleDate: 'desc',
                },
            });
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('vehicle');
            expect(result[0]).toHaveProperty('saleInfo');
            expect(result[0].saleInfo.customerName).toBe('John Doe');
        });

        it('should return empty array when no sales exist', async () => {
            mockPrisma.sale.findMany.mockResolvedValue([]);

            const result = await repository.getSoldVehicles();

            expect(result).toEqual([]);
        });

        it('should map sale info correctly', async () => {
            const mockSales = [
                {
                    saleDate: new Date('2024-01-15'),
                    totalPrice: 95000,
                    vehicle: {
                        id: '2',
                        brand: 'Honda',
                        model: 'Civic',
                        year: 2023,
                        color: 'Black',
                        price: 95000,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    customer: {
                        name: 'Jane Smith',
                        email: 'jane@example.com',
                    },
                },
            ];

            mockPrisma.sale.findMany.mockResolvedValue(mockSales);
            (VehicleMapper.toEntity as jest.Mock).mockImplementation((v: any) => new VehicleEntity(v));

            const result = await repository.getSoldVehicles();

            expect(result[0].saleInfo).toEqual({
                saleDate: mockSales[0].saleDate,
                totalPrice: 95000,
                customerName: 'Jane Smith',
                customerEmail: 'jane@example.com',
            });
        });
    });
});
