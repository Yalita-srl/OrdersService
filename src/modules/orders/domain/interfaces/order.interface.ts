import { OrderEntity } from "../entities/order.entity";
import { StateOrder } from "../entities/state-order.enum";

// interfaz para el repositorio de órdenes
export interface OrderRepositoryInterface {
    save(order: OrderEntity): Promise<OrderEntity>;
    findById(id: number): Promise<OrderEntity | null>;
    findByUserId(userId: number): Promise<OrderEntity[]>;
    findByRestaurantId(restaurantId: number): Promise<OrderEntity[]>;
    updateStateOrder(id: number, state: StateOrder): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}