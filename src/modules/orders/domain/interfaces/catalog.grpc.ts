export interface CatalogGrpcService {
  validateRestaurant(restaurantId: number): Promise<boolean>;

  getProductInfo(productId: number): Promise<{
    id: number;
    name: string;
    description: string;
    price: number;
    available: boolean;
  }>;
}
