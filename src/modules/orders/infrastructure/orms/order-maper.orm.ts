import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { OrderOrmEntity } from './order.orm';
import { OrderItemOrmEntity } from './order-item.orm';

export class OrderMapper {
  static toDomain(orm: OrderOrmEntity): OrderEntity {
    const domain = new OrderEntity();

    domain.id = orm.id;
    domain.userId = orm.userId;
    domain.restaurantId = orm.restaurantId;

    domain.items = orm.items.map(i => {
      const item = new OrderItem();
      item.id = i.id;
      item.productId = i.productId;
      item.quantity = i.quantity;
      item.price = Number(i.price);
      return item;
    });

    domain.stateOrder = orm.stateOrder;
    domain.createdAt = orm.createdAt;
    domain.updatedAt = orm.updatedAt;

    return domain;
  }

  static toOrm(domain: OrderEntity): OrderOrmEntity {
    const orm = new OrderOrmEntity();

    if (domain.id) orm.id = domain.id;

    orm.userId = domain.userId;
    orm.restaurantId = domain.restaurantId;
    orm.stateOrder = domain.stateOrder;

    orm.items = domain.items.map(dItem => {
      const item = new OrderItemOrmEntity();
      item.id = dItem.id;
      item.productId = dItem.productId;
      item.quantity = dItem.quantity;
      item.price = dItem.price;
      return item;
    });

    return orm;
  }
}
