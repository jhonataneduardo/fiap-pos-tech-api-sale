import { Sale } from "@prisma/client";
import { SaleEntity } from "@/modules/vehicle_sales/domain/entities/sale.entity";
import { SaleStatus } from "@/modules/vehicle_sales/domain/entities/enums";

/**
 * SaleMapper
 *
 * Responsável pela conversão entre SaleEntity (domínio) e modelos de persistência (Prisma).
 * Garante que detalhes do domínio não vazem para a camada de infraestrutura e vice-versa.
 */
export class SaleMapper {
    /**
     * Converte modelo Prisma para SaleEntity (domínio)
     */
    static toEntity(prismaSale: Sale): SaleEntity {
        return new SaleEntity({
            id: prismaSale.id,
            vehicleId: prismaSale.vehicleId,
            customerId: prismaSale.customerId,
            saleDate: prismaSale.saleDate,
            paymentCode: prismaSale.paymentCode,
            totalPrice: prismaSale.totalPrice,
            status: prismaSale.status as SaleStatus,
            createdAt: prismaSale.createdAt,
            updatedAt: prismaSale.updatedAt,
        });
    }

    /**
     * Converte SaleEntity (domínio) para dados de persistência (Prisma)
     * Retorna apenas os dados necessários para persistência, sem expor a entidade
     */
    static toPersistence(entity: SaleEntity) {
        return {
            id: entity.id,
            vehicleId: entity.vehicleId,
            customerId: entity.customerId,
            saleDate: entity.saleDate,
            paymentCode: entity.paymentCode,
            totalPrice: entity.totalPrice,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
