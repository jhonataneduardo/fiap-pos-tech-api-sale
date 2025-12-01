import { container } from "./container";
import { systemConfig } from "@/config";

// HTTP Client
import { HttpClient } from "@/core/infrastructure/http/http-client";

// Repositories
import { PrismaVehicleRepository } from "@/modules/vehicle_read/infrastructure/database/repositories/vehicle.repository";
import { PrismaSaleRepository } from "@/modules/vehicle_sales/infrastructure/database/repositories/sale.repository";

// Use Cases
import { FindAvailableVehiclesUseCase } from "@/modules/vehicle_read/application/usecases/find-available-vehicles.usecase";
import { FindSoldVehiclesUseCase } from "@/modules/vehicle_read/application/usecases/find-sold-vehicles.usecase";
import { RegisterNewSaleUseCase } from "@/modules/vehicle_sales/application/usecases/sale/register-new-sale.usecase";
import { UpdatePaymentStatusUseCase } from "@/modules/vehicle_sales/application/usecases/sale/update-payment-status.usecase";

/**
 * setupDependencies
 *
 * Configura e registra todas as dependências no container DI.
 * Deve ser chamado no início da aplicação, antes de qualquer resolução de dependência.
 */
export function setupDependencies(): void {
    // ==========================================
    // HTTP CLIENT (Factory - comunicação com Main API)
    // ==========================================
    container.registerFactory('MainApiClient', () => 
        new HttpClient({
            baseURL: systemConfig.mainApiUrl,
            timeout: 5000,
            retries: 3
        })
    );

    // ==========================================
    // REPOSITORIES (Singleton - compartilhados)
    // ==========================================
    container.registerSingleton('VehicleRepository', PrismaVehicleRepository);
    container.registerSingleton('SaleRepository', PrismaSaleRepository);

    // ==========================================
    // USE CASES (Factory - nova instância com dependências injetadas)
    // ==========================================

    // Vehicle Read Use Cases
    container.registerFactory('FindAvailableVehiclesUseCase', () => {
        const vehicleRepository = container.resolve<PrismaVehicleRepository>('VehicleRepository');
        return new FindAvailableVehiclesUseCase(vehicleRepository);
    });

    container.registerFactory('FindSoldVehiclesUseCase', () => {
        const vehicleRepository = container.resolve<PrismaVehicleRepository>('VehicleRepository');
        return new FindSoldVehiclesUseCase(vehicleRepository);
    });

    // Sale Use Cases
    container.registerFactory('RegisterNewSaleUseCase', () => {
        const saleRepository = container.resolve<PrismaSaleRepository>('SaleRepository');
        const mainApiClient = container.resolve<HttpClient>('MainApiClient');
        return new RegisterNewSaleUseCase(saleRepository, mainApiClient);
    });

    container.registerFactory('UpdatePaymentStatusUseCase', () => {
        const saleRepository = container.resolve<PrismaSaleRepository>('SaleRepository');
        return new UpdatePaymentStatusUseCase(saleRepository);
    });

    // ==========================================
    // CONTROLLERS (Clean Architecture - Application Layer)
    // ==========================================
    container.registerFactory('VehicleController', () => {
        const findAvailableVehiclesUseCase = container.resolve('FindAvailableVehiclesUseCase');
        const findSoldVehiclesUseCase = container.resolve('FindSoldVehiclesUseCase');
        const { VehicleController } = require('@/modules/vehicle_read/application/controllers/vehicle.controller');
        return new VehicleController(
            findAvailableVehiclesUseCase,
            findSoldVehiclesUseCase
        );
    });

    container.registerFactory('SaleController', () => {
        const registerNewSaleUseCase = container.resolve('RegisterNewSaleUseCase');
        const updatePaymentStatusUseCase = container.resolve('UpdatePaymentStatusUseCase');
        const { SaleController } = require('@/modules/vehicle_sales/application/controllers/sale.controller');
        return new SaleController(registerNewSaleUseCase, updatePaymentStatusUseCase);
    });
}
