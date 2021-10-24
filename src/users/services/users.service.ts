import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { ProductsService } from './../../products/services/products.service';
import { Generic } from 'src/common/generic.service';

@Injectable()
export class UsersService extends Generic<
  User,
  number,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    private productsService: ProductsService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    super(userRepo);
    this.setTitleEntity('User');
  }

  async getOrderByUser(id: number) {
    const user = await this.findOne(id);
    return {
      date: new Date(),
      user,
      products: await this.productsService.findAll(),
    };
  }
}
