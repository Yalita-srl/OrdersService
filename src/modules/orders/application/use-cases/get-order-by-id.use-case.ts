import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import { OrderRepositoryInterface } from "../../domain/interfaces/order.interface";
import { OrderEntity } from "../../domain/entities/order.entity";

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly repository: OrderRepositoryInterface
  ) {}

  async execute(id: number): Promise<OrderEntity | null> {
    try {
      const order = await this.repository.findById(id);
      if (!order) {
        throw new NotFoundException('Orden no encontrada');
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la orden');
    }
  }
}
