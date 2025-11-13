import { StateOrder } from './state-order.enum';
import { OrderItem } from './order-item.entity';

// entidad de una orden
export class OrderEntity {
    id!: number;
    userId!: number;
    restaurantId!: number;
    items!: OrderItem[];
    stateOrder!: StateOrder;
    createdAt!: Date;
    updatedAt!: Date;

    get totalAmount(): number {
    return this.items.reduce((sum, i) => sum + i.subtotal, 0);
    }
}