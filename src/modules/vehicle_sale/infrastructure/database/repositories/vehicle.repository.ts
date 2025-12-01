import { PrismaClient } from "@prisma/client";
import prisma from '@/core/infrastructure/database/prisma.client';
import { VehicleRepositoryInterface, SoldVehicle } from "@/modules/vehicle_sale/domain/repositories/vehicle-repository.interface";
import { VehicleEntity } from "@/modules/vehicle_sale/domain/entities/vehicle.entity";
import { VehicleMapper } from "../mappers/vehicle.mapper";

export class PrismaVehicleRepository implements VehicleRepositoryInterface {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    async getAllVehicles(): Promise<VehicleEntity[]> {
        const vehicles = await this.prisma.vehicle.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return vehicles.map(vehicle => VehicleMapper.toEntity(vehicle));
    }

    async getAvailableVehicles(): Promise<VehicleEntity[]> {
        const availableVehicles = await this.prisma.vehicle.findMany({
            where: {
                sales: {
                    none: {} // Veículos que não têm nenhuma venda
                }
            },
            orderBy: {
                price: 'asc' // Ordenar do mais barato para o mais caro
            }
        });

        return availableVehicles.map(vehicle => VehicleMapper.toEntity(vehicle));
    }

    async getSoldVehicles(): Promise<SoldVehicle[]> {
        const salesWithDetails = await this.prisma.sale.findMany({
            include: {
                vehicle: true,
                customer: true
            },
            orderBy: {
                saleDate: 'desc'
            }
        });

        return salesWithDetails.map((sale: any) => ({
            vehicle: VehicleMapper.toEntity(sale.vehicle),
            saleInfo: {
                saleDate: sale.saleDate,
                totalPrice: sale.totalPrice,
                customerName: sale.customer.name,
                customerEmail: sale.customer.email,
            }
        }));
    }
}
