export interface InputSaleDTO {
    vehicle_id: string;
    customer_national_id: string;
    token?: string;
}

export interface OutputSaleDTO {
    id: string;
    vehicle_id: string;
    customer_id: string;
    sale_date: Date;
    payment_code: string;
    total_price: number;
    status: string;
    created_at: Date;
    updated_at: Date;
}

export interface SoldVehicleDTO {
    sale_id: string;
    vehicle_id: string;
    vehicle_brand: string;
    vehicle_model: string;
    vehicle_year: number;
    vehicle_color: string;
    vehicle_price: number;
    sale_date: Date;
    sale_total_price: number;
    payment_code: string;
    sale_status: string;
}

export interface PaymentWebhookDTO {
    payment_code: string;
    status: 'PAID' | 'CANCELLED';
}

export interface PaymentStatusResponseDTO {
    payment_code: string;
    previous_status: string;
    new_status: string;
    updated_at: Date;
}
