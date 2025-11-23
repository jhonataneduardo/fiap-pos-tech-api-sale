import { Request, Response } from "express";
import { container } from "@/core/infrastructure/di/container";
import { VehicleController } from "@/modules/vehicle_read/application/controllers/vehicle.controller";
import { ApiResponseHandler } from "@/core/infrastructure/http/responses";

/**
 * VehicleApiController (HTTP Adapter)
 *
 * Controller da camada de infraestrutura que adapta HTTP (Express) para Clean Architecture.
 */
export class VehicleApiController {
    /**
     * GET /vehicles - Lista todos os vehicles
     */
    static async getAllVehicles(req: Request, res: Response): Promise<void> {
        try {
            const vehicleController = container.resolve<VehicleController>('VehicleController');
            const vehicles = await vehicleController.listAllVehicles();
            ApiResponseHandler.success(res, vehicles);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            ApiResponseHandler.error(res, error as Error);
        }
    }

    /**
     * GET /vehicles/available - Lista vehicles disponíveis
     */
    static async getAvailableVehicles(req: Request, res: Response): Promise<void> {
        try {
            const vehicleController = container.resolve<VehicleController>('VehicleController');
            const vehicles = await vehicleController.listAvailableVehicles();
            ApiResponseHandler.success(res, vehicles);
        } catch (error) {
            console.error("Error fetching available vehicles:", error);
            ApiResponseHandler.error(res, error as Error);
        }
    }

    /**
     * GET /vehicles/sold - Lista vehicles vendidos
     */
    static async getSoldVehicles(req: Request, res: Response): Promise<void> {
        try {
            const vehicleController = container.resolve<VehicleController>('VehicleController');
            const soldVehicles = await vehicleController.listSoldVehicles();
            ApiResponseHandler.success(res, soldVehicles);
        } catch (error) {
            console.error("Error fetching sold vehicles:", error);
            ApiResponseHandler.error(res, error as Error);
        }
    }
}
