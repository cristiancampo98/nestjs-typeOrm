import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './../entities/product.entity';
import { Generic } from 'src/common/generic.service';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';

@Injectable()
export class ProductsService extends Generic<
  Product,
  number,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {
    super(productRepo);
    this.setTitleEntity('Product');
  }
}
