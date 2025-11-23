import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import mainRouter from '@/core/infrastructure/http/routes';
import { swaggerSpec } from '@/core/infrastructure/swagger';
import { setupDependencies } from '@/core/infrastructure/di/setup';

class App {
    public server: Express;

    constructor() {
        this.server = express();
        this.setupDependencyInjection();
        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    private setupDependencyInjection(): void {
        setupDependencies();
        console.log('✅ Dependency Injection Container configured');
    }

    private middlewares(): void {
        this.server.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
        this.server.use(helmet());
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            explorer: true,
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: 'FIAP Pos Tech Read API Documentation'
        }));

        this.server.use('/api/v1', mainRouter);
    }

    private exceptionHandler(): void { }
}

export default new App().server;
