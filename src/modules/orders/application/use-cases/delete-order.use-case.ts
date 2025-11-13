import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import { OrderRepositoryInterface } from "../../domain/interfaces/order.interface";

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly repository: OrderRepositoryInterface
  ) {}

  async execute(id: number): Promise<boolean | null> {
    try {
        const order = await this.repository.findById(id);
        if (!order) {
            throw new NotFoundException('Orden no encontrada');
        }
        return await this.repository.delete(id);
    }catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la orden');
    }
  }
}
