import { VehicleRepositoryInterface } from "@/modules/vehicle_read/domain/repositories/vehicle-repository.interface";
import { VehicleEntity } from "@/modules/vehicle_read/domain/entities/vehicle.entity";

export class ListAllVehiclesUseCase {
    constructor(
        private readonly vehicleRepository: VehicleRepositoryInterface
    ) { }

    async execute(): Promise<VehicleEntity[]> {
        return await this.vehicleRepository.getAllVehicles();
    }
}
