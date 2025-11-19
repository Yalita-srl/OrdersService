import { Injectable } from '@nestjs/common';
import { ICatalogoService } from '../../domain/interfaces/catalogo.service.interface';
import { CatalogoClientService } from '../../../../grcp/catalogo.client.service';

@Injectable()
export class CatalogoGrpcService implements ICatalogoService {
  constructor(private readonly client: CatalogoClientService) {}

  async getRestaurantById(id: number) {
    return this.client.getRestaurantById(id);
  }

  async getProductById(id: number) {
    return this.client.getProductById(id);
  }
}
