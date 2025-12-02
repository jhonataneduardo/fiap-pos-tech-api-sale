export const salePaths = {
    '/sales': {
        post: {
            tags: ['Sales'],
            summary: 'Cria uma nova venda',
            description: 'Registra uma nova venda de veículo para um cliente',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateSaleInput' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Venda criada com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    content: { $ref: '#/components/schemas/Sale' }
                                }
                            }
                        }
                    }
                },
                400: { description: 'Dados inválidos' },
                401: { description: 'Não autenticado' },
                404: { description: 'Cliente ou veículo não encontrado' }
            }
        }
    },
    '/webhook/payment': {
        post: {
            tags: ['Sales'],
            summary: 'Webhook de pagamento',
            description: 'Atualiza o status de pagamento de uma venda (público, sem autenticação)',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/PaymentWebhook' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Status de pagamento atualizado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    content: { $ref: '#/components/schemas/PaymentStatusResponse' }
                                }
                            }
                        }
                    }
                },
                400: { description: 'Dados inválidos ou status já aplicado' },
                404: { description: 'Venda não encontrada' }
            }
        }
    }
};
