import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderItemDto {

  @ApiProperty({
    description: "ID del producto",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  productId!: number;

  @ApiProperty({
    description: "Cantidad del producto",
    example: 2,
  })
  @IsPositive()
  @IsNumber()
  quantity!: number;
}
