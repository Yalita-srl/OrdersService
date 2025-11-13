import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { OrderRepositoryInterface } from '../../domain/interfaces/order.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { StateOrder } from '../../domain/entities/state-order.enum';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface
  ) {}

  async execute(dto: CreateOrderDto): Promise<OrderEntity> {
    // Items del dominio
    const items = dto.items.map((i) => {
      const item = new OrderItem();
      item.productId = i.productId;
      item.quantity = i.quantity;
      item.price = i.price;
      return item;
    });

    try {
      const order = new OrderEntity();
      order.userId = dto.userId;
      order.restaurantId = dto.restaurantId;
      order.items = items;
      order.stateOrder = StateOrder.PENDING;
      return await this.orderRepository.save(order);
    } catch (error) {
    throw new BadRequestException('Error al crear la orden');
    }
  }
}
