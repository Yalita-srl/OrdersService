import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OrderItemOrmEntity } from "./order-item.orm";
import { StateOrder } from "../../domain/entities/state-order.enum";

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id', type: 'int' })
  userId: number;

  @Column({ name: 'restaurante_id', type: 'int' })
  restaurantId: number;

  @OneToMany(() => OrderItemOrmEntity, item => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItemOrmEntity[];

  @Column({ name: 'estado', type: 'enum', enum: StateOrder, default: StateOrder.PENDING })
  stateOrder: StateOrder;

  @CreateDateColumn({ name: 'fecha_creacion' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  updatedAt: Date;
}
