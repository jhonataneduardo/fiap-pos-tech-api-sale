import swaggerJSDoc from 'swagger-jsdoc';
import { schemas } from './schemas';
import { paths } from './paths';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'FIAP Pos Tech Read API',
        version: '1.0.0',
        description: 'Read-only API para consulta de veículos - Tech Challenge FIAP',
        contact: {
            name: 'Jhonatan Eduardo',
            email: 'jhonatanepp@gmail.com'
        }
    },
    servers: [
        {
            url: 'http://localhost:3003/api/v1',
            description: 'Development server'
        }
    ],
    components: {
        schemas,
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token JWT obtido através do serviço de autenticação (fiap-pos-tech-auth)'
            }
        }
    },
    security: [
        {
            BearerAuth: []
        }
    ],
    paths
};

const swaggerOptions: swaggerJSDoc.Options = {
    definition: swaggerDefinition,
    apis: []
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
