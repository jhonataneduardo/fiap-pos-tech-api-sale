import { Vehicle } from "@prisma/client";
import { VehicleEntity } from "@/modules/vehicle_sale/domain/entities/vehicle.entity";

/**
 * VehicleMapper
 *
 * Responsável pela conversão entre VehicleEntity (domínio) e modelos de persistência (Prisma).
 */
export class VehicleMapper {
    /**
     * Converte modelo Prisma para VehicleEntity (domínio)
     */
    static toEntity(prismaVehicle: Vehicle): VehicleEntity {
        return new VehicleEntity({
            id: prismaVehicle.id,
            brand: prismaVehicle.brand,
            model: prismaVehicle.model,
            year: prismaVehicle.year,
            color: prismaVehicle.color,
            price: prismaVehicle.price,
            createdAt: prismaVehicle.createdAt,
            updatedAt: prismaVehicle.updatedAt,
        });
    }
}
