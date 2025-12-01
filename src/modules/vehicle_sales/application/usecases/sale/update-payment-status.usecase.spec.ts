import { UpdatePaymentStatusUseCase } from './update-payment-status.usecase';
import { SaleRepositoryInterface } from '@/modules/vehicle_sales/domain/repositories/sale-respository.interface';
import { PaymentWebhookDTO } from '@/modules/vehicle_sales/application/dtos/sale.dto';
import { SaleEntity } from '@/modules/vehicle_sales/domain/entities/sale.entity';
import { SaleStatus } from '@/modules/vehicle_sales/domain/entities/enums';
import { BadRequestError, NotFoundError } from '@/core/application/errors/app.error';

describe('UpdatePaymentStatusUseCase', () => {
    let useCase: UpdatePaymentStatusUseCase;
    let saleRepository: jest.Mocked<SaleRepositoryInterface>;

    beforeEach(() => {
        saleRepository = {
            createSale: jest.fn(),
            getSaleById: jest.fn(),
            getSaleByPaymentCode: jest.fn(),
            updateSale: jest.fn(),
            updateSaleStatus: jest.fn(),
            getSalesWithVehicles: jest.fn(),
        };
        useCase = new UpdatePaymentStatusUseCase(saleRepository);
    });

    describe('execute', () => {
        const mockPaymentWebhook: PaymentWebhookDTO = {
            payment_code: 'PAY-12345678',
            status: SaleStatus.PAID,
        };

        const mockExistingSale = new SaleEntity({
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

        it('should update payment status successfully', async () => {
            // Arrange
            saleRepository.getSaleByPaymentCode.mockResolvedValue(mockExistingSale);
            
            const updatedSale = new SaleEntity({
                ...mockExistingSale,
                status: SaleStatus.PAID,
                updatedAt: new Date(),
            });
            saleRepository.updateSaleStatus.mockResolvedValue(updatedSale);

            // Act
            const result = await useCase.execute(mockPaymentWebhook);

            // Assert
            expect(saleRepository.getSaleByPaymentCode).toHaveBeenCalledWith('PAY-12345678');
            expect(saleRepository.updateSaleStatus).toHaveBeenCalledWith(
                'PAY-12345678',
                SaleStatus.PAID
            );
            expect(result.payment_code).toBe('PAY-12345678');
            expect(result.previous_status).toBe(SaleStatus.PENDING);
            expect(result.new_status).toBe(SaleStatus.PAID);
            expect(result.updated_at).toBeDefined();
        });

        it('should throw NotFoundError when sale is not found', async () => {
            // Arrange
            saleRepository.getSaleByPaymentCode.mockResolvedValue(null);

            // Act & Assert
            await expect(useCase.execute(mockPaymentWebhook)).rejects.toThrow(NotFoundError);
            await expect(useCase.execute(mockPaymentWebhook)).rejects.toThrow(
                `Sale with payment code ${mockPaymentWebhook.payment_code} not found.`
            );
            expect(saleRepository.getSaleByPaymentCode).toHaveBeenCalledWith('PAY-12345678');
            expect(saleRepository.updateSaleStatus).not.toHaveBeenCalled();
        });

        it('should throw BadRequestError when status is invalid', async () => {
            // Arrange
            saleRepository.getSaleByPaymentCode.mockResolvedValue(mockExistingSale);
            const invalidWebhook = {
                payment_code: 'PAY-12345678',
                status: 'INVALID_STATUS' as any,
            };

            // Act & Assert
            await expect(useCase.execute(invalidWebhook)).rejects.toThrow(BadRequestError);
            await expect(useCase.execute(invalidWebhook)).rejects.toThrow(
                'Invalid payment status: INVALID_STATUS'
            );
            expect(saleRepository.updateSaleStatus).not.toHaveBeenCalled();
        });

        it('should throw BadRequestError when status is already the same', async () => {
            // Arrange
            const saleWithPaidStatus = new SaleEntity({
                ...mockExistingSale,
                status: SaleStatus.PAID,
            });
            saleRepository.getSaleByPaymentCode.mockResolvedValue(saleWithPaidStatus);

            // Act & Assert
            await expect(useCase.execute(mockPaymentWebhook)).rejects.toThrow(BadRequestError);
            await expect(useCase.execute(mockPaymentWebhook)).rejects.toThrow(
                `Payment status is already ${SaleStatus.PAID} for payment code ${mockPaymentWebhook.payment_code}.`
            );
            expect(saleRepository.updateSaleStatus).not.toHaveBeenCalled();
        });

        it('should update from PENDING to CANCELLED', async () => {
            // Arrange
            saleRepository.getSaleByPaymentCode.mockResolvedValue(mockExistingSale);
            
            const cancelledSale = new SaleEntity({
                ...mockExistingSale,
                status: SaleStatus.CANCELLED,
                updatedAt: new Date(),
            });
            saleRepository.updateSaleStatus.mockResolvedValue(cancelledSale);

            const cancelWebhook: PaymentWebhookDTO = {
                payment_code: 'PAY-12345678',
                status: SaleStatus.CANCELLED,
            };

            // Act
            const result = await useCase.execute(cancelWebhook);

            // Assert
            expect(result.previous_status).toBe(SaleStatus.PENDING);
            expect(result.new_status).toBe(SaleStatus.CANCELLED);
            expect(saleRepository.updateSaleStatus).toHaveBeenCalledWith(
                'PAY-12345678',
                SaleStatus.CANCELLED
            );
        });

        it('should propagate repository errors', async () => {
            // Arrange
            saleRepository.getSaleByPaymentCode.mockResolvedValue(mockExistingSale);
            const error = new Error('Database error');
            saleRepository.updateSaleStatus.mockRejectedValue(error);

            // Act & Assert
            await expect(useCase.execute(mockPaymentWebhook)).rejects.toThrow('Database error');
        });
    });
});
