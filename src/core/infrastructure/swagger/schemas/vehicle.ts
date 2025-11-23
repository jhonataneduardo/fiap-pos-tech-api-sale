export const vehicleSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        brand: { type: 'string', example: 'Toyota' },
        model: { type: 'string', example: 'Corolla' },
        year: { type: 'integer', example: 2023 },
        color: { type: 'string', example: 'Prata' },
        price: { type: 'number', example: 95000 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
    }
};

export const soldVehicleSchema = {
    type: 'object',
    properties: {
        vehicle: { $ref: '#/components/schemas/Vehicle' },
        saleInfo: {
            type: 'object',
            properties: {
                saleDate: { type: 'string', format: 'date-time' },
                totalPrice: { type: 'number' },
                customerName: { type: 'string' },
                customerEmail: { type: 'string', format: 'email' },
            }
        }
    }
};
