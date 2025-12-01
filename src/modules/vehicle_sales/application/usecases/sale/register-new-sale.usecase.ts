import { UseCaseInterface } from "@/core/application/use-case.interface";
import { NotFoundError } from "@/core/application/errors/app.error";
import prisma from '@/core/infrastructure/database/prisma.client';

import { SaleRepositoryInterface } from "@/modules/vehicle_sales/domain/repositories/sale-respository.interface";
import { InputSaleDTO, OutputSaleDTO } from "@/modules/vehicle_sales/application/dtos/sale.dto";
import { SaleEntityFactory } from "@/modules/vehicle_sales/domain/entities/sale.entity";
import { SaleStatus } from "@/modules/vehicle_sales/domain/entities/enums";
import { HttpClient } from "@/core/infrastructure/http/http-client";

interface CustomerResponse {
    id: string;
    name: string;
    email: string;
    national_id: string;
    status: string;
}

interface VehicleResponse {
    id: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    price: number;
}

export class RegisterNewSaleUseCase implements UseCaseInterface<InputSaleDTO, OutputSaleDTO> {
    constructor(
        private readonly saleRepository: SaleRepositoryInterface,
        private readonly mainApiClient: HttpClient
    ) { }

    async execute(request: InputSaleDTO): Promise<OutputSaleDTO> {
        // Fetch customer from Main API via HTTP
        const customers = await this.mainApiClient.get<CustomerResponse[]>(
            `/customers?national_id=${request.customer_national_id}`,
            request.token
        );
        
        if (!customers || customers.length === 0) {
            throw new NotFoundError(`Customer with national ID ${request.customer_national_id} not found.`);
        }
        const customer = customers[0];

        // Fetch vehicle from Main API via HTTP
        const vehicle = await this.mainApiClient.get<VehicleResponse>(
            `/vehicles/${request.vehicle_id}`,
            request.token
        );
        
        if (!vehicle) {
            throw new NotFoundError(`Vehicle with ID ${request.vehicle_id} not found.`);
        }

        // Upsert customer into local database (create or update if exists)
        await prisma.customer.upsert({
            where: { id: customer.id },
            create: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                nationalId: customer.national_id,
                status: customer.status as any,
            },
            update: {
                name: customer.name,
                email: customer.email,
                status: customer.status as any,
            },
        });

        // Upsert vehicle into local database (create or update if exists)
        await prisma.vehicle.upsert({
            where: { id: vehicle.id },
            create: {
                id: vehicle.id,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                price: vehicle.price,
            },
            update: {
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                price: vehicle.price,
            },
        });

        const dateNow = new Date();
        
        const newSale = await this.saleRepository.createSale(SaleEntityFactory.create({
            vehicleId: request.vehicle_id,
            customerId: customer.id,
            saleDate: dateNow,
            totalPrice: vehicle.price,
            status: SaleStatus.PENDING,
            createdAt: dateNow,
            updatedAt: dateNow,
        }));

        return {
            id: newSale.id,
            vehicle_id: newSale.vehicleId,
            customer_id: newSale.customerId,
            sale_date: newSale.saleDate,
            payment_code: newSale.paymentCode,
            total_price: newSale.totalPrice,
            status: newSale.status,
            created_at: newSale.createdAt,
            updated_at: newSale.updatedAt,
        } as OutputSaleDTO;
    }
}
