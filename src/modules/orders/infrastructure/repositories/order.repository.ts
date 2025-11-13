import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { OrderRepositoryInterface } from "../../domain/interfaces/order.interface";
import { OrderEntity } from "../../domain/entities/order.entity";
import { StateOrder } from "../../domain/entities/state-order.enum";

import { OrderOrmEntity } from "../orms/order.orm";
import { OrderMapper } from "../orms/order-maper.orm";

@Injectable()
export class OrderRepository implements OrderRepositoryInterface {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly ormRepo: Repository<OrderOrmEntity>
  ) {}

  async save(order: OrderEntity): Promise<OrderEntity> {
    const ormEntity = OrderMapper.toOrm(order);

    const saved = await this.ormRepo.save(ormEntity);

    return OrderMapper.toDomain(saved);
  }

  async findById(id: number): Promise<OrderEntity | null> {
    const ormOrder = await this.ormRepo.findOne({
      where: { id },
      relations: ["items"],
    });

    return ormOrder ? OrderMapper.toDomain(ormOrder) : null;
  }

  async findByUserId(userId: number): Promise<OrderEntity[] | null> {
    const ormOrders = await this.ormRepo.find({
      where: { userId },
      relations: ["items"],
    });

    return ormOrders.length > 0
      ? ormOrders.map(o => OrderMapper.toDomain(o))
      : null;
  }

  async findByRestaurantId(restaurantId: number): Promise<OrderEntity[] | null> {
    const ormOrders = await this.ormRepo.find({
      where: { restaurantId },
      relations: ["items"],
    });

    return ormOrders.length > 0
      ? ormOrders.map(o => OrderMapper.toDomain(o))
      : null;
  }

  async updateStateOrder(id: number, state: StateOrder): Promise<boolean> {
    const result = await this.ormRepo.update(id, {
      stateOrder: state,
      updatedAt: new Date(),
    });

    return result.affected !== 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepo.delete(id);
    return result.affected !== 0;
  }
}
