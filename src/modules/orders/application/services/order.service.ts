import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { StateOrder } from "../../domain/entities/state-order.enum";
import * as amqp from 'amqplib';
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

  async publishToRabbitMQ(queue: string, data: any) {
    try {
      const connection = await amqp.connect('amqp://rabbitmq:5672');
      const channel = await connection.createChannel();
      
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
        persistent: true
      });
      
      await channel.close();
      await connection.close();
      
      console.log(`✅ Mensaje publicado en cola ${queue}:`, data);
    } catch (error) {
      console.error('❌ Error publicando en RabbitMQ:', error);
      // No fallar la operación principal por error en notificación
    }
  }
}
