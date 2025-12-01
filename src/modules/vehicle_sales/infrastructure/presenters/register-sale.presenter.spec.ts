import { RegisterSalePresenter } from './register-sale.presenter';
import { OutputSaleDTO } from '@/modules/vehicle_sales/application/dtos/sale.dto';
import { SaleStatus } from '@/modules/vehicle_sales/domain/entities/enums';

describe('RegisterSalePresenter', () => {
    describe('present', () => {
        it('should format sale output to view model', () => {
            // Arrange
            const saleOutput: OutputSaleDTO = {
                id: 'sale-123',
                vehicle_id: 'vehicle-123',
                customer_id: 'customer-123',
                sale_date: new Date('2024-01-15'),
                payment_code: 'PAY-12345678',
                total_price: 25000,
                status: SaleStatus.PENDING,
                created_at: new Date('2024-01-15'),
                updated_at: new Date('2024-01-15'),
            };

            // Act
            const result = RegisterSalePresenter.present(saleOutput);

            // Assert
            expect(result).toEqual({
                id: 'sale-123',
                vehicle_id: 'vehicle-123',
                customer_id: 'customer-123',
                sale_date: new Date('2024-01-15'),
                payment_code: 'PAY-12345678',
                total_price: 25000,
                status: SaleStatus.PENDING,
                created_at: new Date('2024-01-15'),
                updated_at: new Date('2024-01-15'),
            });
        });
    });
});
