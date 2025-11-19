import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CatalogoClientService } from './catalogo.client.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATALOGO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'catalogo',
          protoPath: join(__dirname, '../../protos/catalogo/catalogo.proto'),
          url: process.env.GRPC_ADAPTER_URL || '172.17.0.1:50051'
        },
      },
    ]),
  ],
  providers: [CatalogoClientService],
  exports: [CatalogoClientService],
})
export class CatalogoGrpcModule {}
