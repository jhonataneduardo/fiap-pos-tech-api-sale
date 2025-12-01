import { PaymentStatusResponseDTO } from "@/modules/vehicle_sales/application/dtos/sale.dto";

/**
 * UpdatePaymentStatusPresenter
 *
 * Responsável por formatar a saída do caso de uso UpdatePaymentStatusUseCase
 * para uma representação adequada à camada de apresentação (API/HTTP).
 * Garante que apenas dados relevantes sejam expostos, sem vazar detalhes do domínio.
 */
export class UpdatePaymentStatusPresenter {
    /**
     * Formata o resultado do use case para view model HTTP
     */
    static present(paymentStatusResponse: PaymentStatusResponseDTO) {
        return {
            payment_code: paymentStatusResponse.payment_code,
            previous_status: paymentStatusResponse.previous_status,
            new_status: paymentStatusResponse.new_status,
            updated_at: paymentStatusResponse.updated_at,
        };
    }
}
