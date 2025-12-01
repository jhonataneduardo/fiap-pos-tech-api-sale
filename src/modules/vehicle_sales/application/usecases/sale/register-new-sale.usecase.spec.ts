import { RegisterNewSaleUseCase } from './register-new-sale.usecase';
import { SaleRepositoryInterface } from '@/modules/vehicle_sales/domain/repositories/sale-respository.interface';
import { HttpClient } from '@/core/infrastructure/http/http-client';
import { InputSaleDTO } from '@/modules/vehicle_sales/application/dtos/sale.dto';
import { SaleEntity } from '@/modules/vehicle_sales/domain/entities/sale.entity';
import { SaleStatus } from '@/modules/vehicle_sales/domain/entities/enums';
import { NotFoundError } from '@/core/application/errors/app.error';
import prisma from '@/core/infrastructure/database/prisma.client';

jest.mock('@/core/infrastructure/database/prisma.client', () => ({
    __esModule: true,
    default: {
        customer: {
            upsert: jest.fn(),
        },
        vehicle: {
            upsert: jest.fn(),
        },
    },
}));

describe('RegisterNewSaleUseCase', () => {
    let useCase: RegisterNewSaleUseCase;
    let saleRepository: jest.Mocked<SaleRepositoryInterface>;
    let httpClient: jest.Mocked<HttpClient>;

    beforeEach(() => {
        jest.clearAllMocks();
        
        saleRepository = {
            createSale: jest.fn(),
            getSaleById: jest.fn(),
            getSaleByPaymentCode: jest.fn(),
            updateSale: jest.fn(),
            updateSaleStatus: jest.fn(),
            getSalesWithVehicles: jest.fn(),
        };

        httpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        } as any;

        useCase = new RegisterNewSaleUseCase(saleRepository, httpClient);
    });

    describe('execute', () => {
        const mockInputSale: InputSaleDTO = {
            vehicle_id: 'vehicle-123',
            customer_national_id: '12345678900',
            token: 'bearer-token-123',
        };

        const mockCustomerResponse = [
            {
                id: 'customer-123',
                name: 'John Doe',
                email: 'john@example.com',
                national_id: '12345678900',
                status: 'ACTIVE',
            },
        ];

        const mockVehicleResponse = {
            id: 'vehicle-123',
            brand: 'Toyota',
            model: 'Corolla',
            year: 2023,
            color: 'White',
            price: 25000,
        };

        it('should register a new sale successfully', async () => {
            // Arrange
            httpClient.get
                .mockResolvedValueOnce(mockCustomerResponse)
                .mockResolvedValueOnce(mockVehicleResponse);

            const mockSaleEntity = new SaleEntity({
                id: 'sale-123',
                vehicleId: 'vehicle-123',
                customerId: 'customer-123',
                saleDate: new Date(),
                paymentCode: 'PAY-12345678',
                totalPrice: 25000,
                status: SaleStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            saleRepository.createSale.mockResolvedValue(mockSaleEntity);

            // Act
            const result = await useCase.execute(mockInputSale);

            // Assert
            expect(httpClient.get).toHaveBeenCalledWith(
                `/customers?national_id=${mockInputSale.customer_national_id}`,
                mockInputSale.token
            );
            expect(httpClient.get).toHaveBeenCalledWith(
                `/vehicles/${mockInputSale.vehicle_id}`,
                mockInputSale.token
            );
            expect(prisma.customer.upsert).toHaveBeenCalledWith({
                where: { id: 'customer-123' },
                create: {
                    id: 'customer-123',
                    name: 'John Doe',
                    email: 'john@example.com',
                    nationalId: '12345678900',
                    status: 'ACTIVE',
                },
                update: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    status: 'ACTIVE',
                },
            });
            expect(prisma.vehicle.upsert).toHaveBeenCalledWith({
                where: { id: 'vehicle-123' },
                create: {
                    id: 'vehicle-123',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2023,
                    color: 'White',
                    price: 25000,
                },
                update: {
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2023,
                    color: 'White',
                    price: 25000,
                },
            });
            expect(saleRepository.createSale).toHaveBeenCalled();
            expect(result.id).toBe('sale-123');
            expect(result.status).toBe(SaleStatus.PENDING);
            expect(result.total_price).toBe(25000);
        });

        it('should throw NotFoundError when customer is not found', async () => {
            // Arrange
            httpClient.get.mockResolvedValueOnce([]);

            // Act & Assert
            await expect(useCase.execute(mockInputSale)).rejects.toThrow(NotFoundError);
            await expect(useCase.execute(mockInputSale)).rejects.toThrow(
                `Customer with national ID ${mockInputSale.customer_national_id} not found.`
            );
            expect(saleRepository.createSale).not.toHaveBeenCalled();
        });

        it('should throw NotFoundError when customer response is null', async () => {
            // Arrange
            httpClient.get.mockResolvedValueOnce(null);

            // Act & Assert
            await expect(useCase.execute(mockInputSale)).rejects.toThrow(NotFoundError);
            expect(saleRepository.createSale).not.toHaveBeenCalled();
        });

        it('should throw NotFoundError when vehicle is not found', async () => {
            // Arrange - need to clear mocks from previous test and set up fresh
            jest.clearAllMocks();
            httpClient.get
                .mockResolvedValueOnce(mockCustomerResponse)
                .mockResolvedValueOnce(null);

            // Act & Assert
            await expect(useCase.execute(mockInputSale)).rejects.toThrow(NotFoundError);
            expect(saleRepository.createSale).not.toHaveBeenCalled();
        });

        it('should propagate errors from HTTP client', async () => {
            // Arrange
            const error = new Error('Network error');
            httpClient.get.mockRejectedValueOnce(error);

            // Act & Assert
            await expect(useCase.execute(mockInputSale)).rejects.toThrow('Network error');
            expect(saleRepository.createSale).not.toHaveBeenCalled();
        });

        it('should propagate errors from repository', async () => {
            // Arrange
            httpClient.get
                .mockResolvedValueOnce(mockCustomerResponse)
                .mockResolvedValueOnce(mockVehicleResponse);

            const error = new Error('Database error');
            saleRepository.createSale.mockRejectedValueOnce(error);

            // Act & Assert
            await expect(useCase.execute(mockInputSale)).rejects.toThrow('Database error');
        });
    });
});
