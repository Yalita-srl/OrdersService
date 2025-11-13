import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { OrderService } from "../../application/services/order.service";
import { CreateOrderDto } from "../../application/dtos/create-order.dto";
import { StateOrder } from "../../domain/entities/state-order.enum";
import { OrderEntity } from "../../domain/entities/order.entity";

// Auth
import { JwtAuthGuard } from "../../../auth/jwt-auth.guard";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags("Orders")
@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // -------------------------------------------------------
  // CREATE ORDER
  // -------------------------------------------------------
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Crear una nueva orden" })
  async create(@Req() req: any, @Body() dto: CreateOrderDto): Promise<OrderEntity> {
    dto.userId = Number(req.user.id); // usuario autenticado
    return this.orderService.create(dto);
  }

  // -------------------------------------------------------
  // GET ORDER BY ID
  // -------------------------------------------------------
  @Get(":id")
  @ApiOperation({ summary: "Obtener una orden por ID" })
  async findById(@Req() req: any, @Param("id", ParseIntPipe) id: number): Promise<OrderEntity> {
    const order = await this.orderService.findById(id);

    // Solo dueño o admin
    if (order.userId !== Number(req.user.id) && req.user.role !== "admin") {
      throw new ForbiddenException("No tienes permiso para ver esta orden");
    }

    return order;
  }

  // -------------------------------------------------------
  // GET ORDERS BY USER
  // -------------------------------------------------------
  @Get("user/:userId")
  @ApiOperation({ summary: "Obtener órdenes por ID de usuario" })
  async findByUser(
    @Req() req: any,
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<OrderEntity[]> {
    if (Number(req.user.id) !== userId && req.user.role !== "admin") {
      throw new ForbiddenException("No tienes permiso para ver estas órdenes");
    }

    return this.orderService.findByUser(userId);
  }

  // -------------------------------------------------------
  // GET ORDERS BY RESTAURANT
  // Solo ADMIN puede consultar
  // -------------------------------------------------------
  @Get("restaurant/:restId")
  @ApiOperation({ summary: "Obtener órdenes por ID de restaurante" })
  async findByRestaurant(
    @Req() req: any,
    @Param("restId", ParseIntPipe) restId: number
  ): Promise<OrderEntity[]> {
    if (req.user.role !== "admin") {
      throw new ForbiddenException("No tienes permiso para ver órdenes de restaurantes");
    }

    return this.orderService.findByRestaurant(restId);
  }

  // -------------------------------------------------------
  // UPDATE STATE (admin o dueño de la orden)
  // -------------------------------------------------------
  // En tu order.controller.ts
  @Put(":id/state/:state")
  @ApiOperation({ summary: "Actualizar el estado de una orden" })
  async updateState(
    @Req() req: any,
    @Param("id", ParseIntPipe) id: number,
    @Param("state") state: StateOrder
  ): Promise<any> {  // Cambiar a any para retornar JSON
    const order = await this.orderService.findById(id);
    
    // Solo dueño o admin
    if (order.userId !== Number(req.user.id) && req.user.role !== "admin") {
      throw new ForbiddenException("No tienes permiso para cambiar el estado de esta orden");
    }

    const success = await this.orderService.updateState(id, state);
    
    // Si es un pago exitoso, retornar datos para notificación
    if (success && state === StateOrder.PAYED) {
      const notificationData = {
        type: 'PAYMENT_CONFIRMATION',
        orderId: id,
        userId: order.userId,
        userEmail: req.user.email, // Del token
        amount: order.totalAmount, // Si tienes este campo
        status: 'paid',
        timestamp: new Date().toISOString()
      };
      
      // Publicar a RabbitMQ
      await this.orderService.publishToRabbitMQ('payment_events', notificationData);
      
      return {
        success: true,
        message: 'Orden pagada exitosamente',
        notification: 'Notificación de pago enviada',
        data: notificationData
      };
    }
    
    return { success: true, message: 'Estado actualizado' };
  }

  // -------------------------------------------------------
  // DELETE ORDER
  // -------------------------------------------------------
  @Delete(":id")
  @ApiOperation({ summary: "Eliminar una orden" })
  async delete(@Req() req: any, @Param("id", ParseIntPipe) id: number): Promise<boolean> {
    const order = await this.orderService.findById(id);

    // Solo dueño o admin
    if (order.userId !== Number(req.user.id) && req.user.role !== "admin") {
      throw new ForbiddenException("No puedes eliminar esta orden");
    }

    return this.orderService.delete(id);
  }
}
