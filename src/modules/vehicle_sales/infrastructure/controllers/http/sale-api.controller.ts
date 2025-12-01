import { Request, Response } from "express";
import { container } from "@/core/infrastructure/di/container";
import { SaleController } from "@/modules/vehicle_sales/application/controllers/sale.controller";
import { ApiResponseHandler } from "@/core/infrastructure/http/responses";

/**
 * SaleApiController (HTTP Adapter)
 *
 * Controller da camada de infraestrutura que adapta HTTP (Express) para Clean Architecture.
 * Responsável por:
 * - Extrair dados do Request (body, params, query)
 * - Delegar processamento para o SaleController (Clean)
 * - Formatar Response HTTP com status codes adequados
 */
export class SaleApiController {
    /**
     * POST /sales - Cria uma nova venda
     */
    static async createSale(req: Request, res: Response): Promise<void> {
        try {
            const saleController = container.resolve<SaleController>('SaleController');

            // Extract token from Authorization header
            const authHeader = req.headers.authorization;
            const token = authHeader?.replace('Bearer ', '');

            const input = {
                vehicle_id: req.body.vehicle_id,
                customer_national_id: req.body.customer_national_id,
                token: token,
            };

            const sale = await saleController.registerSale(input);

            ApiResponseHandler.success(res, sale, 201);
        } catch (error) {
            console.error("Error creating sale:", error);
            ApiResponseHandler.error(res, error as Error);
        }
    }

    /**
     * POST /sales/webhook - Webhook para atualizar status de pagamento
     */
    static async updatePaymentStatus(req: Request, res: Response): Promise<void> {
        try {
            const saleController = container.resolve<SaleController>('SaleController');

            const webhookData = {
                payment_code: req.body.payment_code,
                status: req.body.status,
            };

            const result = await saleController.updatePaymentStatus(webhookData);

            ApiResponseHandler.success(res, result);
        } catch (error) {
            console.error("Error updating payment status:", error);
            ApiResponseHandler.error(res, error as Error);
        }
    }
}
