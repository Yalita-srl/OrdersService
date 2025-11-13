import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ORM entities
import { OrderOrmEntity } from './infrastructure/orms/order.orm';
import { OrderItemOrmEntity } from './infrastructure/orms/order-item.orm';

// Repository (infraestructura)
import { OrderRepository } from './infrastructure/repositories/order.repository';

// Use cases
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetOrderByIdUseCase } from './application/use-cases/get-order-by-id.use-case';
import { GetOrdersByUserUseCase } from './application/use-cases/get-orders-by-user.use-case';
import { GetOrdersByRestaurantUseCase } from './application/use-cases/get-orders-by-restaurant.use-case';
import { UpdateOrderStateUseCase } from './application/use-cases/update-order-state.use-case';
import { DeleteOrderUseCase } from './application/use-cases/delete-order.use-case';

// Service
import { OrderService } from './application/services/order.service';

// Controller
import { OrderController } from './infrastructure/controllers/order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderOrmEntity,
      OrderItemOrmEntity,
    ]),
  ],
  controllers: [OrderController],

  providers: [
    // Repositorio concreto de infraestructura
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },

    // Casos de uso
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    GetOrdersByUserUseCase,
    GetOrdersByRestaurantUseCase,
    UpdateOrderStateUseCase,
    DeleteOrderUseCase,

    // Servicio orquestador
    OrderService,
  ],

  exports: [
    OrderService,
    'OrderRepositoryInterface',
  ],
})
export class OrdersModule {}
