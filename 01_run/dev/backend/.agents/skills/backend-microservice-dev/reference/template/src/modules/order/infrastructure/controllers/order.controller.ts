import { randomUUID } from 'crypto';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrdersQueryDto } from './dtos/get-orders.dto';
import { CreateOrderCommand } from '../../application/commands/create-order/create-order.command';
import { ProcessOrderCommand } from '../../application/commands/process-order/process-order.command';
import { ApproveOrderCommand } from '../../application/commands/approve-order/approve-order.command';
import { CancelOrderCommand } from '../../application/commands/cancel-order/cancel-order.command';
import { GetOrderByIdQuery } from '../../application/queries/get-order-by-id/get-order-by-id.query';
import { GetOrdersQuery } from '../../application/queries/get-orders/get-orders.query';

/**
 * Controlador HTTP: totalmente agnóstico a la lógica de negocio.
 *
 * Reglas aplicadas:
 * - Sin try/catch: cualquier excepción de dominio lanzada por un
 *   handler se propaga y es capturada por el `DomainExceptionFilter`
 *   global (infraestructura), que la traduce a una respuesta HTTP.
 * - Su única responsabilidad es: recibir la petición, validar/mapear
 *   el payload (DTOs + class-validator) y despachar al CommandBus o al
 *   QueryBus.
 */
@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto): Promise<{ id: string }> {
    const orderId = randomUUID();
    return this.commandBus.execute(
      new CreateOrderCommand(orderId, dto.customerId, dto.amount),
    );
  }

  @Post(':id/process')
  @HttpCode(HttpStatus.NO_CONTENT)
  process(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new ProcessOrderCommand(id));
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  approve(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new ApproveOrderCommand(id));
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancel(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new CancelOrderCommand(id));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.queryBus.execute(new GetOrderByIdQuery(id));
  }

  @Get()
  findAll(@Query() query: GetOrdersQueryDto) {
    return this.queryBus.execute(
      new GetOrdersQuery(query.status, query.page, query.limit),
    );
  }
}
