import { container } from "./container";

// Repositories
import { PrismaVehicleRepository } from "@/modules/vehicle_read/infrastructure/database/repositories/vehicle.repository";

// Use Cases
import { ListAllVehiclesUseCase } from "@/modules/vehicle_read/application/usecases/list-all-vehicles.usecase";
import { FindAvailableVehiclesUseCase } from "@/modules/vehicle_read/application/usecases/find-available-vehicles.usecase";
import { FindSoldVehiclesUseCase } from "@/modules/vehicle_read/application/usecases/find-sold-vehicles.usecase";

/**
 * setupDependencies
 *
 * Configura e registra todas as dependências no container DI.
 * Deve ser chamado no início da aplicação, antes de qualquer resolução de dependência.
 */
export function setupDependencies(): void {
    // ==========================================
    // REPOSITORIES (Singleton - compartilhados)
    // ==========================================
    container.registerSingleton('VehicleRepository', PrismaVehicleRepository);

    // ==========================================
    // USE CASES (Factory - nova instância com dependências injetadas)
    // ==========================================

    // Vehicle Read Use Cases
    container.registerFactory('ListAllVehiclesUseCase', () => {
        const vehicleRepository = container.resolve<PrismaVehicleRepository>('VehicleRepository');
        return new ListAllVehiclesUseCase(vehicleRepository);
    });

    container.registerFactory('FindAvailableVehiclesUseCase', () => {
        const vehicleRepository = container.resolve<PrismaVehicleRepository>('VehicleRepository');
        return new FindAvailableVehiclesUseCase(vehicleRepository);
    });

    container.registerFactory('FindSoldVehiclesUseCase', () => {
        const vehicleRepository = container.resolve<PrismaVehicleRepository>('VehicleRepository');
        return new FindSoldVehiclesUseCase(vehicleRepository);
    });

    // ==========================================
    // CONTROLLERS (Clean Architecture - Application Layer)
    // ==========================================
    container.registerFactory('VehicleController', () => {
        const listAllVehiclesUseCase = container.resolve('ListAllVehiclesUseCase');
        const findAvailableVehiclesUseCase = container.resolve('FindAvailableVehiclesUseCase');
        const findSoldVehiclesUseCase = container.resolve('FindSoldVehiclesUseCase');
        const { VehicleController } = require('@/modules/vehicle_read/application/controllers/vehicle.controller');
        return new VehicleController(
            listAllVehiclesUseCase,
            findAvailableVehiclesUseCase,
            findSoldVehiclesUseCase
        );
    });
}
