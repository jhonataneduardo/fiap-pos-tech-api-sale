import { SaleEntity } from "../entities/sale.entity";

export interface SaleWithVehicleData {
  sale: SaleEntity;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    price: number;
  };
}

export interface SaleRepositoryInterface {
  createSale(sale: SaleEntity, txContext?: unknown): Promise<SaleEntity>;
  getSaleById(saleId: string, txContext?: unknown): Promise<SaleEntity>;
  getSaleByPaymentCode(paymentCode: string, txContext?: unknown): Promise<SaleEntity | null>;
  updateSale(saleId: string, saleData: SaleEntity, txContext?: unknown): Promise<SaleEntity>;
  updateSaleStatus(paymentCode: string, status: string, txContext?: unknown): Promise<SaleEntity>;
  getSalesWithVehicles(txContext?: unknown): Promise<SaleWithVehicleData[]>;
}
