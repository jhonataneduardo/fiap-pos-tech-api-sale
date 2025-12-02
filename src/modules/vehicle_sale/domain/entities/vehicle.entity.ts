import { BaseEntity, BaseEntityProps } from "@/core/domain/entities/base.entity";

export interface VehicleEntityProps extends BaseEntityProps {
    brand: string
    model: string
    year: number
    color: string
    price: number
}

export class VehicleEntity extends BaseEntity {
    public brand: string;
    public model: string;
    public year: number;
    public color: string;
    public price: number;

    constructor(props: VehicleEntityProps) {
        super(props);
        this.brand = props.brand;
        this.model = props.model;
        this.year = props.year;
        this.color = props.color;
        this.price = props.price;
    }
}
