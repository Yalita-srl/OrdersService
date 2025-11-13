import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

// Módulo de órdenes
import { OrdersModule } from './modules/orders/orders.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,           
      envFilePath: '.env',  
      load: [],    
    }),
    DatabaseModule,
    OrdersModule,
    AuthModule,
  ],
})
export class AppModule {}
