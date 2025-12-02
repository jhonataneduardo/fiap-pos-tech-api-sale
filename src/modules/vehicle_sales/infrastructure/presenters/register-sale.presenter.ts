import { OutputSaleDTO } from "@/modules/vehicle_sales/application/dtos/sale.dto";

/**
 * RegisterSalePresenter
 *
 * Responsável por formatar a saída do caso de uso RegisterNewSaleUseCase
 * para uma representação adequada à camada de apresentação (API/HTTP).
 * Garante que apenas dados relevantes sejam expostos, sem vazar detalhes do domínio.
 */
export class RegisterSalePresenter {
    /**
     * Formata o resultado do use case para view model HTTP
     */
    static present(sale: OutputSaleDTO) {
        return {
            id: sale.id,
            vehicle_id: sale.vehicle_id,
            customer_id: sale.customer_id,
            sale_date: sale.sale_date,
            payment_code: sale.payment_code,
            total_price: sale.total_price,
            status: sale.status,
            created_at: sale.created_at,
            updated_at: sale.updated_at,
        };
    }
}
