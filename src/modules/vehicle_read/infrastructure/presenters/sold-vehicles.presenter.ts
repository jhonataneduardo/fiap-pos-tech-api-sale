import { SoldVehicle } from "@/modules/vehicle_read/domain/repositories/vehicle-repository.interface";
import { SoldVehicleOutputDTO } from "../../application/dtos/vehicle.dto";

export class SoldVehiclesPresenter {
    static present(soldVehicles: SoldVehicle[]): SoldVehicleOutputDTO[] {
        return soldVehicles.map(({ vehicle, saleInfo }) => ({
            vehicle: {
                id: vehicle.id,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                price: vehicle.price,
                createdAt: vehicle.createdAt,
                updatedAt: vehicle.updatedAt,
            },
            saleInfo: {
                saleDate: saleInfo.saleDate,
                totalPrice: saleInfo.totalPrice,
                customerName: saleInfo.customerName,
                customerEmail: saleInfo.customerEmail,
            },
        }));
    }
}
