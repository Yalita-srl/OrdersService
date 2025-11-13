import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { OrderRepositoryInterface } from "../../domain/interfaces/order.interface";
import { OrderEntity } from "../../domain/entities/order.entity";

@Injectable()
export class GetOrdersByUserUseCase {
  constructor(
    @Inject("OrderRepositoryInterface")
    private readonly repository: OrderRepositoryInterface
  ) {}

  async execute(userId: number): Promise<OrderEntity[]> {
    try {
      if (!userId || userId <= 0) {
        throw new BadRequestException('userId inválido');
      }
      const orders = await this.repository.findByUserId(userId);
      return orders ?? [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener las órdenes por usuario');
    }
  }
}
