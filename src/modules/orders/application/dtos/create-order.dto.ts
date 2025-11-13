import { ApiProperty } from "@nestjs/swagger";
import { 
  IsNotEmpty, 
  IsNumber, 
  IsArray, 
  ValidateNested, 
  ArrayMinSize, 
  IsEnum,
  IsOptional
} from "class-validator";
import { Type } from "class-transformer";
import { OrderItemDto } from "./order-item.dto";
import { StateOrder } from "../../domain/entities/state-order.enum";

export class CreateOrderDto {

  @ApiProperty({
    description: "ID del usuario que realiza la orden",
    example: 123,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({
    description: "ID del restaurante donde se realiza la orden",
    example: 456,
  })
  @IsNotEmpty()
  @IsNumber()
  restaurantId!: number;

  @ApiProperty({
    description: "Lista de productos de la orden",
    type: [OrderItemDto]
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
