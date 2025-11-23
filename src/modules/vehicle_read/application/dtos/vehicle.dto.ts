export interface VehicleOutputDTO {
    id: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SoldVehicleOutputDTO {
    vehicle: VehicleOutputDTO;
    saleInfo: {
        saleDate: Date;
        totalPrice: number;
        customerName: string;
        customerEmail: string;
    };
}
