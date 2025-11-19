import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderRepositoryInterface } from '../../domain/interfaces/order.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { StateOrder } from '../../domain/entities/state-order.enum';
import { ICatalogoService } from '../../domain/interfaces/catalogo.service.interface';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,

    @Inject('ICatalogoService')
    private readonly catalogoService: ICatalogoService,
  ) {}

  async execute(dto: CreateOrderDto): Promise<OrderEntity> {
    // 1. VALIDAR RESTAURANTE
    const restaurante = await this.catalogoService.getRestaurantById(dto.restaurantId);

    if (!restaurante) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    if (restaurante.estado !== 'Abierto') {
      throw new BadRequestException('El restaurante está cerrado');
    }

    // 2. VALIDAR PRODUCTOS Y CALCULAR TOTAL
    let totalAmount = 0;
    const items: OrderItem[] = [];

    for (const itemDto of dto.items) {
      const product = await this.catalogoService.getProductById(itemDto.productId);

      if (!product) {
        throw new NotFoundException(`El producto ${itemDto.productId} no existe`);
      }

      if (!product.disponible) {
        throw new BadRequestException(`El producto ${product.nombre} no está disponible`);
      }

      if (product.restauranteId !== dto.restaurantId) {
        throw new BadRequestException(
          `El producto ${product.nombre} no pertenece al restaurante seleccionado`
        );
      }

      // Usar precio REAL desde catálogo (no confiar en el cliente)
      const orderItem = new OrderItem();
      orderItem.productId = product.id;
      orderItem.quantity = itemDto.quantity;
      orderItem.price = product.precio;

      totalAmount += product.precio * itemDto.quantity;

      items.push(orderItem);
    }

    // 3. CREAR ENTIDAD ORDEN DEL DOMINIO
    const order = new OrderEntity();
    order.userId = dto.userId;
    order.restaurantId = dto.restaurantId;
    order.items = items;
    order.stateOrder = StateOrder.PENDING;

    // 4. GUARDAR
    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new BadRequestException('Error al crear la orden');
    }
  }
}
