export interface ICatalogoService {
  getRestaurantById(id: number): Promise<any>;
  getProductById(id: number): Promise<any>;
}
