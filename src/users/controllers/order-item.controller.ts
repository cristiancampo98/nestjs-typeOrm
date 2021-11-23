import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderItemDto } from '../dtos/order-item.dto';
import { OrderItemService } from '../services/order-item.service';

@ApiTags('Order Item')
@Controller('order-item')
export class OrderItemController {
  constructor(private itemService: OrderItemService) {}
  @Post()
  create(@Body() payload: CreateOrderItemDto) {
    return this.itemService.create(payload);
  }
}
