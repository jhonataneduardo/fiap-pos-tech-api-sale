export const saleSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        vehicle_id: { type: 'string', format: 'uuid' },
        customer_id: { type: 'string', format: 'uuid' },
        sale_date: { type: 'string', format: 'date-time' },
        payment_code: { type: 'string', example: 'PAY-ABC12345' },
        total_price: { type: 'number', example: 95000 },
        status: { 
            type: 'string', 
            enum: ['PENDING', 'PAID', 'CANCELLED'],
            example: 'PENDING'
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
    }
};

export const createSaleInputSchema = {
    type: 'object',
    required: ['vehicle_id', 'customer_national_id'],
    properties: {
        vehicle_id: { 
            type: 'string', 
            format: 'uuid',
            description: 'ID do veículo a ser vendido'
        },
        customer_national_id: { 
            type: 'string', 
            example: '12345678900',
            description: 'CPF do cliente'
        }
    }
};

export const paymentWebhookSchema = {
    type: 'object',
    required: ['payment_code', 'status'],
    properties: {
        payment_code: { 
            type: 'string', 
            example: 'PAY-ABC12345',
            description: 'Código de pagamento da venda'
        },
        status: { 
            type: 'string', 
            enum: ['PAID', 'CANCELLED'],
            description: 'Novo status do pagamento'
        }
    }
};

export const paymentStatusResponseSchema = {
    type: 'object',
    properties: {
        payment_code: { type: 'string', example: 'PAY-ABC12345' },
        previous_status: { type: 'string', example: 'PENDING' },
        new_status: { type: 'string', example: 'PAID' },
        updated_at: { type: 'string', format: 'date-time' }
    }
};
