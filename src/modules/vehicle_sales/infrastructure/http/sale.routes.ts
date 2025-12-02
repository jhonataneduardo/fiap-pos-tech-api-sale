import express from 'express';
import { SaleApiController } from '../controllers/http/sale-api.controller';
import { authenticate } from '@core/infrastructure/http/middlewares/auth.middleware';

const SaleRouter = express.Router();

// Criar venda requer autenticação
SaleRouter.post('/sales', authenticate, SaleApiController.createSale);

// Webhook de pagamento é público (autenticado via webhook secret)
SaleRouter.post('/webhook/payment', SaleApiController.updatePaymentStatus);

export default SaleRouter;
