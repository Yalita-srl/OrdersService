import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { StateOrder } from "../../domain/entities/state-order.enum";

import { CreateOrderUseCase } from "../use-cases/create-order.use-case";
import { GetOrderByIdUseCase } from "../use-cases/get-order-by-id.use-case";
import { GetOrdersByUserUseCase } from "../use-cases/get-orders-by-user.use-case";
import { GetOrdersByRestaurantUseCase } from "../use-cases/get-orders-by-restaurant.use-case";
import { UpdateOrderStateUseCase } from "../use-cases/update-order-state.use-case";
import { DeleteOrderUseCase } from "../use-cases/delete-order.use-case";

@Injectable()
export class OrderService {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly getOrdersByUserUseCase: GetOrdersByUserUseCase,
    private readonly getOrdersByRestaurantUseCase: GetOrdersByRestaurantUseCase,
    private readonly updateOrderStateUseCase: UpdateOrderStateUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
) {}

  create(dto: CreateOrderDto) {
    return this.createOrderUseCase.execute(dto);
  }

  findById(id: number) {
    return this.getOrderByIdUseCase.execute(id);
  }

  findByUser(userId: number) {
    return this.getOrdersByUserUseCase.execute(userId);
  }

  findByRestaurant(restId: number) {
    return this.getOrdersByRestaurantUseCase.execute(restId);
  }

  updateState(id: number, state: StateOrder) {
    return this.updateOrderStateUseCase.execute(id, state);
  }

  delete(id: number) {
    return this.deleteOrderUseCase.execute(id);
  }
}
