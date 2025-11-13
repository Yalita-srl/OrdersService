import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

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
  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @ApiProperty({
    description: "Precio del producto",
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  price!: number;
}
