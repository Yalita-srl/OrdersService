import { ApiProperty } from "@nestjs/swagger";
import { StateOrder } from "../../domain/entities/state-order.enum";

export class OrderResponseDto {
  
  @ApiProperty()
  id!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  restaurantId!: number;

  @ApiProperty()
  totalAmount!: number;

  @ApiProperty({ enum: StateOrder })
  stateOrder!: StateOrder;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({
    description: "Lista de ítems de la orden",
    type: "array",
  })
  items!: {
    productId: number;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}
