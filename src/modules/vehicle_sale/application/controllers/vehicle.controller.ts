import { FindAvailableVehiclesUseCase } from "../usecases/find-available-vehicles.usecase";
import { FindSoldVehiclesUseCase } from "../usecases/find-sold-vehicles.usecase";
import { AvailableVehiclesPresenter } from "@/modules/vehicle_sale/infrastructure/presenters/available-vehicles.presenter";
import { SoldVehiclesPresenter } from "@/modules/vehicle_sale/infrastructure/presenters/sold-vehicles.presenter";

/**
 * VehicleController (Clean Architecture)
 *
 * Controller da camada de aplicação que orquestra use cases e presenters.
 * NÃO conhece detalhes de HTTP (Request/Response).
 * Recebe dados já parseados e retorna view models formatados.
 */
export class VehicleController {
    constructor(
        private readonly findAvailableVehiclesUseCase: FindAvailableVehiclesUseCase,
        private readonly findSoldVehiclesUseCase: FindSoldVehiclesUseCase
    ) { }

    /**
     * Lista vehicles disponíveis (sem vendas)
     */
    async listAvailableVehicles() {
        const vehicles = await this.findAvailableVehiclesUseCase.execute();
        return AvailableVehiclesPresenter.present(vehicles);
    }

    /**
     * Lista vehicles vendidos (com informações de venda)
     */
    async listSoldVehicles() {
        const soldVehicles = await this.findSoldVehiclesUseCase.execute();
        return SoldVehiclesPresenter.present(soldVehicles);
    }
}
