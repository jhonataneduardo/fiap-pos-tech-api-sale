import { VehicleEntity } from "@/modules/vehicle_sale/domain/entities/vehicle.entity";
import { VehicleOutputDTO } from "../../application/dtos/vehicle.dto";

export class AvailableVehiclesPresenter {
    static present(vehicles: VehicleEntity[]): VehicleOutputDTO[] {
        return vehicles.map(vehicle => ({
            id: vehicle.id,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color,
            price: vehicle.price,
            createdAt: vehicle.createdAt,
            updatedAt: vehicle.updatedAt,
        }));
    }
}
