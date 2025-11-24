import { VehicleEntity, VehicleEntityProps } from './vehicle.entity';

describe('VehicleEntity', () => {
    const mockProps: VehicleEntityProps = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Silver',
        price: 85000,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    it('should create a vehicle entity with correct properties', () => {
        const vehicle = new VehicleEntity(mockProps);

        expect(vehicle.id).toBe(mockProps.id);
        expect(vehicle.brand).toBe(mockProps.brand);
        expect(vehicle.model).toBe(mockProps.model);
        expect(vehicle.year).toBe(mockProps.year);
        expect(vehicle.color).toBe(mockProps.color);
        expect(vehicle.price).toBe(mockProps.price);
        expect(vehicle.createdAt).toEqual(mockProps.createdAt);
        expect(vehicle.updatedAt).toEqual(mockProps.updatedAt);
    });

    it('should inherit from BaseEntity', () => {
        const vehicle = new VehicleEntity(mockProps);

        expect(vehicle).toHaveProperty('id');
        expect(vehicle).toHaveProperty('createdAt');
        expect(vehicle).toHaveProperty('updatedAt');
    });

    it('should have all vehicle-specific properties', () => {
        const vehicle = new VehicleEntity(mockProps);

        expect(vehicle).toHaveProperty('brand');
        expect(vehicle).toHaveProperty('model');
        expect(vehicle).toHaveProperty('year');
        expect(vehicle).toHaveProperty('color');
        expect(vehicle).toHaveProperty('price');
    });

    it('should match all properties from constructor', () => {
        const vehicle = new VehicleEntity(mockProps);

        expect(vehicle).toMatchObject(mockProps);
    });

    it('should handle different vehicle data', () => {
        const differentProps: VehicleEntityProps = {
            id: '987e6543-e21b-43d2-b654-321654987000',
            brand: 'Honda',
            model: 'Civic',
            year: 2023,
            color: 'Black',
            price: 95000,
            createdAt: new Date('2024-02-01T00:00:00.000Z'),
            updatedAt: new Date('2024-02-02T00:00:00.000Z'),
        };

        const vehicle = new VehicleEntity(differentProps);

        expect(vehicle).toMatchObject(differentProps);
    });
});
