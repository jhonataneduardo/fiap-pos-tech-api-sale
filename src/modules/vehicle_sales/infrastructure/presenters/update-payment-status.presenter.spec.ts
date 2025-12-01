import { UpdatePaymentStatusPresenter } from './update-payment-status.presenter';
import { PaymentStatusResponseDTO } from '@/modules/vehicle_sales/application/dtos/sale.dto';
import { SaleStatus } from '@/modules/vehicle_sales/domain/entities/enums';

describe('UpdatePaymentStatusPresenter', () => {
    describe('present', () => {
        it('should format payment status response to view model', () => {
            // Arrange
            const paymentStatusResponse: PaymentStatusResponseDTO = {
                payment_code: 'PAY-12345678',
                previous_status: SaleStatus.PENDING,
                new_status: SaleStatus.PAID,
                updated_at: new Date('2024-01-16'),
            };

            // Act
            const result = UpdatePaymentStatusPresenter.present(paymentStatusResponse);

            // Assert
            expect(result).toEqual({
                payment_code: 'PAY-12345678',
                previous_status: SaleStatus.PENDING,
                new_status: SaleStatus.PAID,
                updated_at: new Date('2024-01-16'),
            });
        });
    });
});
