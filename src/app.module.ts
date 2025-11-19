import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

// Módulo de órdenes
import { OrdersModule } from './modules/orders/orders.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogoGrpcModule } from './grcp/catalogo.grpc.module';


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
    CatalogoGrpcModule,
  ],
})
export class AppModule {}
