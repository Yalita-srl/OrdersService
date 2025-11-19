import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface ProductService {
  GetProductById(data: { id: number });
  ListProductsByRestaurant(data: { restaurante_id: number });
}

interface RestaurantService {
  GetRestaurantById(data: { id: number });
}

@Injectable()
export class CatalogoClientService implements OnModuleInit {
  private productService: ProductService;
  private restaurantService: RestaurantService;

  constructor(@Inject('CATALOGO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductService>('ProductService');
    this.restaurantService = this.client.getService<RestaurantService>('RestaurantService');
  }

  async getProductById(id: number) {
    return firstValueFrom(this.productService.GetProductById({ id }));
  }

  async getRestaurantById(id: number) {
    return firstValueFrom(this.restaurantService.GetRestaurantById({ id }));
  }
}
