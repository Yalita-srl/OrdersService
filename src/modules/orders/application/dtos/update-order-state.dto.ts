import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StateOrder } from '../../domain/entities/state-order.enum';

export class UpdateOrderStateDto {
  @ApiProperty({ enum: StateOrder })
  @IsEnum(StateOrder)
  stateOrder: StateOrder;
}
