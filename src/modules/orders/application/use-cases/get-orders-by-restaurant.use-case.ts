import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { OrderRepositoryInterface } from "../../domain/interfaces/order.interface";
import { OrderEntity } from "../../domain/entities/order.entity";

@Injectable()
export class GetOrdersByRestaurantUseCase {
  constructor(
    @Inject("OrderRepositoryInterface")
    private readonly repository: OrderRepositoryInterface
  ) {}

  async execute(restaurantId: number): Promise<OrderEntity[]> {
    try {
      if (!restaurantId || restaurantId <= 0) {
        throw new BadRequestException('restaurantId inválido');
      }
      const orders = await this.repository.findByRestaurantId(restaurantId);
      return orders ?? [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Error al obtener las órdenes por restaurante'
      );
    }
  }
}
