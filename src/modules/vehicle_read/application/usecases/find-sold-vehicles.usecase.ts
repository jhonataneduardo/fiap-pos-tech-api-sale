import { VehicleRepositoryInterface, SoldVehicle } from "@/modules/vehicle_read/domain/repositories/vehicle-repository.interface";

export class FindSoldVehiclesUseCase {
    constructor(
        private readonly vehicleRepository: VehicleRepositoryInterface
    ) { }

    async execute(): Promise<SoldVehicle[]> {
        return await this.vehicleRepository.getSoldVehicles();
    }
}
