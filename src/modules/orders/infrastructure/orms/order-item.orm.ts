import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { OrderOrmEntity } from "./order.orm";

@Entity('order_items')
export class OrderItemOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderOrmEntity, order => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orden_id' })
  order!: OrderOrmEntity;

  @Column({ name: 'producto_id', type: 'int' })
  productId: number;

  @Column({ name: 'cantidad', type: 'int' })
  quantity: number;

  @Column({ name: 'precio', type: 'decimal', precision: 10, scale: 2 })
  price: number;
}