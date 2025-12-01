import { vehicleSchema, soldVehicleSchema } from './vehicle';
import { saleSchema, createSaleInputSchema, paymentWebhookSchema, paymentStatusResponseSchema } from './sale';

export const schemas = {
    Vehicle: vehicleSchema,
    SoldVehicle: soldVehicleSchema,
    Sale: saleSchema,
    CreateSaleInput: createSaleInputSchema,
    PaymentWebhook: paymentWebhookSchema,
    PaymentStatusResponse: paymentStatusResponseSchema,
};
