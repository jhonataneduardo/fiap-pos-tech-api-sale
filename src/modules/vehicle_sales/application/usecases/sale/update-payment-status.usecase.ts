import { UseCaseInterface } from "@/core/application/use-case.interface";
import { BadRequestError, NotFoundError } from "@/core/application/errors/app.error";

import { SaleRepositoryInterface } from "@/modules/vehicle_sales/domain/repositories/sale-respository.interface";
import { PaymentWebhookDTO, PaymentStatusResponseDTO } from "@/modules/vehicle_sales/application/dtos/sale.dto";
import { SaleStatus } from "@/modules/vehicle_sales/domain/entities/enums";

export class UpdatePaymentStatusUseCase implements UseCaseInterface<PaymentWebhookDTO, PaymentStatusResponseDTO> {
    constructor(private readonly saleRepository: SaleRepositoryInterface) { }

    async execute(request: PaymentWebhookDTO): Promise<PaymentStatusResponseDTO> {
        const { payment_code, status } = request;

        const existingSale = await this.saleRepository.getSaleByPaymentCode(payment_code);
        if (!existingSale) {
            throw new NotFoundError(`Sale with payment code ${payment_code} not found.`);
        }

        if (!Object.values(SaleStatus).includes(status as SaleStatus)) {
            throw new BadRequestError(`Invalid payment status: ${status}. Valid statuses are: ${Object.values(SaleStatus).join(', ')}`);
        }

        const previousStatus = existingSale.status;

        if (previousStatus === status) {
            throw new BadRequestError(`Payment status is already ${status} for payment code ${payment_code}.`);
        }

        const updatedSale = await this.saleRepository.updateSaleStatus(payment_code, status);

        return {
            payment_code: updatedSale.paymentCode,
            previous_status: previousStatus,
            new_status: updatedSale.status,
            updated_at: updatedSale.updatedAt,
        } as PaymentStatusResponseDTO;
    }
}
