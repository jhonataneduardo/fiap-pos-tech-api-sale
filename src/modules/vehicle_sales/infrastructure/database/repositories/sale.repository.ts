import { PrismaClient } from "@prisma/client";

import prisma from '@/core/infrastructure/database/prisma.client';

import { SaleRepositoryInterface, SaleWithVehicleData } from "@/modules/vehicle_sales/domain/repositories/sale-respository.interface";
import { SaleEntity } from "@/modules/vehicle_sales/domain/entities/sale.entity";
import { SaleStatus } from "@/modules/vehicle_sales/domain/entities/enums";
import { SaleMapper } from "../mappers/sale.mapper";

export class PrismaSaleRepository implements SaleRepositoryInterface {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    async createSale(saleData: SaleEntity): Promise<SaleEntity> {
        const sale = await this.prisma.sale.create({
            data: SaleMapper.toPersistence(saleData),
        });

        return SaleMapper.toEntity(sale);
    }

    async getSaleById(saleId: string): Promise<SaleEntity> {
        const sale = await this.prisma.sale.findUniqueOrThrow({
            where: { id: saleId },
        });

        return SaleMapper.toEntity(sale);
    }

    async getSaleByPaymentCode(paymentCode: string, txContext?: unknown): Promise<SaleEntity | null> {
        const prismaClient = txContext ? txContext as PrismaClient : this.prisma;

        const sale = await prismaClient.sale.findUnique({
            where: { paymentCode: paymentCode },
        });

        return sale ? SaleMapper.toEntity(sale) : null;
    }

    async updateSale(saleId: string, saleData: SaleEntity, txContext?: unknown): Promise<SaleEntity> {
        const prismaClient = txContext ? txContext as PrismaClient : this.prisma;

        const updatedSale = await prismaClient.sale.update({
            where: { id: saleId },
            data: {
                vehicleId: saleData.vehicleId,
                customerId: saleData.customerId,
                saleDate: saleData.saleDate,
                paymentCode: saleData.paymentCode,
                totalPrice: saleData.totalPrice,
                status: saleData.status,
                updatedAt: new Date(),
            },
        });

        return SaleMapper.toEntity(updatedSale);
    }

    async updateSaleStatus(paymentCode: string, status: string, txContext?: unknown): Promise<SaleEntity> {
        const prismaClient = txContext ? txContext as PrismaClient : this.prisma;

        const updatedSale = await prismaClient.sale.update({
            where: { paymentCode: paymentCode },
            data: {
                status: status as SaleStatus,
                updatedAt: new Date(),
            },
        });

        return SaleMapper.toEntity(updatedSale);
    }

    async getSalesWithVehicles(txContext?: unknown): Promise<SaleWithVehicleData[]> {
        const prismaClient = txContext ? txContext as PrismaClient : this.prisma;

        const salesWithVehicles = await prismaClient.sale.findMany({
            include: {
                vehicle: true
            },
            orderBy: {
                vehicle: {
                    price: 'asc'
                }
            }
        });

        return salesWithVehicles.map((saleWithVehicle: any) => ({
            sale: SaleMapper.toEntity(saleWithVehicle),
            vehicle: {
                id: saleWithVehicle.vehicle.id,
                brand: saleWithVehicle.vehicle.brand,
                model: saleWithVehicle.vehicle.model,
                year: saleWithVehicle.vehicle.year,
                color: saleWithVehicle.vehicle.color,
                price: saleWithVehicle.vehicle.price,
            }
        }));
    }
}
