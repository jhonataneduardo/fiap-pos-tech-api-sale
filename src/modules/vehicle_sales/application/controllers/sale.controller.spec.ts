import { SaleController } from './sale.controller';
import { RegisterNewSaleUseCase } from '../usecases/sale/register-new-sale.usecase';
import { UpdatePaymentStatusUseCase } from '../usecases/sale/update-payment-status.usecase';
import { InputSaleDTO, OutputSaleDTO, PaymentWebhookDTO, PaymentStatusResponseDTO } from '../dtos/sale.dto';
import { SaleStatus } from '@/modules/vehicle_sales/domain/entities/enums';

describe('SaleController', () => {
    let controller: SaleController;
    let registerNewSaleUseCase: jest.Mocked<RegisterNewSaleUseCase>;
    let updatePaymentStatusUseCase: jest.Mocked<UpdatePaymentStatusUseCase>;

    beforeEach(() => {
        registerNewSaleUseCase = {
            execute: jest.fn(),
        } as any;

        updatePaymentStatusUseCase = {
            execute: jest.fn(),
        } as any;

        controller = new SaleController(
            registerNewSaleUseCase,
            updatePaymentStatusUseCase
        );
    });

    describe('registerSale', () => {
        it('should register a new sale and return formatted response', async () => {
            // Arrange
            const inputSale: InputSaleDTO = {
                vehicle_id: 'vehicle-123',
                customer_national_id: '12345678900',
                token: 'bearer-token-123',
            };

            const mockOutputSale: OutputSaleDTO = {
                id: 'sale-123',
                vehicle_id: 'vehicle-123',
                customer_id: 'customer-123',
                sale_date: new Date(),
                payment_code: 'PAY-12345678',
                total_price: 25000,
                status: SaleStatus.PENDING,
                created_at: new Date(),
                updated_at: new Date(),
            };

            registerNewSaleUseCase.execute.mockResolvedValue(mockOutputSale);

            // Act
            const result = await controller.registerSale(inputSale);

            // Assert
            expect(result).toEqual(mockOutputSale);
            expect(registerNewSaleUseCase.execute).toHaveBeenCalledWith(inputSale);
            expect(registerNewSaleUseCase.execute).toHaveBeenCalledTimes(1);
        });
    });

    describe('updatePaymentStatus', () => {
        it('should update payment status and return formatted response', async () => {
            // Arrange
            const webhookData: PaymentWebhookDTO = {
                payment_code: 'PAY-12345678',
                status: SaleStatus.PAID,
            };

            const mockPaymentResponse: PaymentStatusResponseDTO = {
                payment_code: 'PAY-12345678',
                previous_status: SaleStatus.PENDING,
                new_status: SaleStatus.PAID,
                updated_at: new Date(),
            };

            updatePaymentStatusUseCase.execute.mockResolvedValue(mockPaymentResponse);

            // Act
            const result = await controller.updatePaymentStatus(webhookData);

            // Assert
            expect(result).toEqual(mockPaymentResponse);
            expect(updatePaymentStatusUseCase.execute).toHaveBeenCalledWith(webhookData);
            expect(updatePaymentStatusUseCase.execute).toHaveBeenCalledTimes(1);
        });
    });
});
