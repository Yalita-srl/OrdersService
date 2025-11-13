import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({ description: 'ID del pago generado por el servicio de pagos' })
  @IsNumber()
  @IsNotEmpty()
  paymentId: number;
}
