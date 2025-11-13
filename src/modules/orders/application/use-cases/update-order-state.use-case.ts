import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import { OrderRepositoryInterface } from "../../domain/interfaces/order.interface";
import { StateOrder } from "../../domain/entities/state-order.enum";

@Injectable()
export class UpdateOrderStateUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly repository: OrderRepositoryInterface
  ) {}

  async execute(id: number, newState: StateOrder): Promise<boolean | null> {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    this.validateTransition(order.stateOrder, newState);

    try {
      return await this.repository.updateStateOrder(id, newState);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el estado de la orden');
    }
  }

  private validateTransition(current: StateOrder, next: StateOrder): void {
    if (current === next) {
      throw new BadRequestException(`La orden ya está en estado ${current}`);
    }

    if (current === StateOrder.PENDING && next === StateOrder.PAYED) return;

    throw new BadRequestException(
      `Transición inválida: no se puede cambiar de ${current} a ${next}`
    );
  }
}
