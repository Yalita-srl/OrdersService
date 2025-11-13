export class OrderItem {
  id!: number;
  productId!: number;
  quantity!: number;
  price!: number;

  get subtotal(): number {
    return this.quantity * this.price;
  }
}
