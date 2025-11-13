import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../../application/services/order.service";
import { CreateOrderDto } from "../../application/dtos/create-order.dto";
import { StateOrder } from "../../domain/entities/state-order.enum";
import { OrderEntity } from "../../domain/entities/order.entity";

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({ status: 201, description: 'La orden ha sido creada exitosamente.', type: OrderEntity })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return this.orderService.create(createOrderDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiResponse({ status: 200, description: 'La orden ha sido encontrada.', type: OrderEntity })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<OrderEntity> {
    return this.orderService.findById(id);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener órdenes por ID de usuario' })
  @ApiResponse({ status: 200, description: 'Órdenes encontradas.', type: [OrderEntity] })
  @ApiResponse({ status: 404, description: 'Órdenes no encontradas.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<OrderEntity[]> {
    return this.orderService.findByUser(userId);
  }

  @Get('restaurant/:restId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener órdenes por ID de restaurante' })
  @ApiResponse({ status: 200, description: 'Órdenes encontradas.', type: [OrderEntity] })
  @ApiResponse({ status: 404, description: 'Órdenes no encontradas.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findByRestaurant(@Param('restId', ParseIntPipe) restId: number): Promise<OrderEntity[]> {
    return this.orderService.findByRestaurant(restId);
  }

  @Put(':id/state/:state')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar el estado de una orden' })
  @ApiResponse({ status: 200, description: 'El estado de la orden ha sido actualizado.', type: Boolean })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async updateState(
    @Param('id', ParseIntPipe) id: number,
    @Param('state') state: StateOrder
  ): Promise<boolean> {
    return this.orderService.updateState(id, state);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiResponse({ status: 200, description: 'La orden ha sido eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.orderService.delete(id);
  }
}