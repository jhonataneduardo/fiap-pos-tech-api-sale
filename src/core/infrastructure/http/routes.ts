import { Router } from 'express';
import VehicleRouter from '@/modules/vehicle_read/infrastructure/http/vehicle.routes';

const mainRouter = Router();

mainRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

mainRouter.use('/', VehicleRouter);

export default mainRouter;
