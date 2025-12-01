import { VehicleEntity } from "../entities/vehicle.entity";

export interface SoldVehicle {
    vehicle: VehicleEntity;
    saleInfo: {
        saleDate: Date;
        totalPrice: number;
        customerName: string;
        customerEmail: string;
    };
}

export interface VehicleRepositoryInterface {
    getAllVehicles(): Promise<VehicleEntity[]>;
    getAvailableVehicles(): Promise<VehicleEntity[]>;
    getSoldVehicles(): Promise<SoldVehicle[]>;
}
