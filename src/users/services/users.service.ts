import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { ProductsService } from './../../products/services/products.service';
import { Generic } from 'src/common/generic.service';
import { CustomersService } from './customers.service';

@Injectable()
export class UsersService extends Generic<
  User,
  number,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    private productsService: ProductsService,
    private customerService: CustomersService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    super(userRepo);
    this.setTitleEntity('User');
  }

  findAll() {
    return this.userRepo.find({
      relations: ['customer'],
    });
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    if (data.customerId) {
      const customer = await this.customerService.findOne(data.customerId);
      newUser.customer = customer;
    }
    return this.userRepo.save(newUser);
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
