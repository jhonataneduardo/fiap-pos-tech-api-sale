export const vehiclePaths = {
    '/vehicles': {
        get: {
            tags: ['Vehicles'],
            summary: 'Lista todos os veículos',
            description: 'Retorna a lista completa de todos os veículos cadastrados',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Lista de veículos retornada com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    content: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Vehicle' }
                                    }
                                }
                            }
                        }
                    }
                },
                401: { description: 'Não autenticado' }
            }
        }
    },
    '/vehicles/available': {
        get: {
            tags: ['Vehicles'],
            summary: 'Lista veículos disponíveis',
            description: 'Retorna apenas os veículos que ainda não foram vendidos',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Lista de veículos disponíveis',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    content: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Vehicle' }
                                    }
                                }
                            }
                        }
                    }
                },
                401: { description: 'Não autenticado' }
            }
        }
    },
    '/vehicles/sold': {
        get: {
            tags: ['Vehicles'],
            summary: 'Lista veículos vendidos',
            description: 'Retorna os veículos vendidos com informações da venda',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Lista de veículos vendidos',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    content: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/SoldVehicle' }
                                    }
                                }
                            }
                        }
                    }
                },
                401: { description: 'Não autenticado' }
            }
        }
    }
};
