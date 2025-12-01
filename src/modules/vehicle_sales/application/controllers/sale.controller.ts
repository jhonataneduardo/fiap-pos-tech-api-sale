import { RegisterNewSaleUseCase } from "../usecases/sale/register-new-sale.usecase";
import { UpdatePaymentStatusUseCase } from "../usecases/sale/update-payment-status.usecase";
import { InputSaleDTO, PaymentWebhookDTO } from "../dtos/sale.dto";
import { RegisterSalePresenter } from "@/modules/vehicle_sales/infrastructure/presenters/register-sale.presenter";
import { UpdatePaymentStatusPresenter } from "@/modules/vehicle_sales/infrastructure/presenters/update-payment-status.presenter";

/**
 * SaleController (Clean Architecture)
 *
 * Controller da camada de aplicação que orquestra use cases e presenters.
 * NÃO conhece detalhes de HTTP (Request/Response).
 * Recebe dados já parseados e retorna view models formatados.
 */
export class SaleController {
    constructor(
        private readonly registerNewSaleUseCase: RegisterNewSaleUseCase,
        private readonly updatePaymentStatusUseCase: UpdatePaymentStatusUseCase
    ) {}

    /**
     * Registra uma nova venda
     */
    async registerSale(input: InputSaleDTO) {
        const sale = await this.registerNewSaleUseCase.execute(input);
        return RegisterSalePresenter.present(sale);
    }

    /**
     * Atualiza o status de pagamento via webhook
     */
    async updatePaymentStatus(webhookData: PaymentWebhookDTO) {
        const paymentStatusResponse = await this.updatePaymentStatusUseCase.execute(webhookData);
        return UpdatePaymentStatusPresenter.present(paymentStatusResponse);
    }
}
