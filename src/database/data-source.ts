import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { OrderEntity } from 'src/modules/orders/domain/entities/order.entity';
import { OrderItem } from 'src/modules/orders/domain/entities/order-item.entity';

config(); 

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    //ssl: { rejectUnauthorized: false },
    entities: [
        OrderEntity,
        OrderItem
    ],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
});
