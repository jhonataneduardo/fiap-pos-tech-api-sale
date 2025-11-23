import { VehicleEntity } from "@/modules/vehicle_read/domain/entities/vehicle.entity";
import { VehicleOutputDTO } from "../../application/dtos/vehicle.dto";

export class ListVehiclesPresenter {
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
