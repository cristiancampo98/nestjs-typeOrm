import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './../entities/product.entity';
import { Generic } from 'src/common/generic.service';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class ProductsService extends Generic<
  Product,
  number,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {
    super(productRepo);
    this.setTitleEntity('Product');
  }

  async findOne(id: number) {
    const item = await this.productRepo.findOne(id, {
      relations: ['brand', 'categories'],
    });
    if (!item) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return item;
  }

  findAll() {
    return this.productRepo.find({
      relations: ['brand', 'categories'],
    });
  }

  async create(data: CreateProductDto) {
    const newProduct = this.productRepo.create(data);
    if (data.brandId) {
      const brand = await this.brandRepo.findOne(data.brandId);
      newProduct.brand = brand;
    }
    if (data.categoriesIds) {
      const categories = await this.categoryRepo.findByIds(data.categoriesIds);
      newProduct.categories = categories;
    }
    return this.productRepo.save(newProduct);
  }

  async update(id: number, data: UpdateProductDto) {
    const product = await this.productRepo.findOne(id);
    if (data.brandId) {
      const brand = await this.brandRepo.findOne(data.brandId);
      product.brand = brand;
    }
    if (data.categoriesIds) {
      const categories = await this.categoryRepo.findByIds(data.categoriesIds);
      product.categories = categories;
    }

    this.productRepo.merge(product, data);
    return this.productRepo.save(product);
  }

  async removeCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.productRepo.findOne(productId, {
      relations: ['categories'],
    });
    product.categories = product.categories.filter(
      (item) => item.id !== categoryId,
    );
    return this.productRepo.save(product);
  }

  async addCategoryToProduct(productId: number, categoryId: number) {
    const product = await this.productRepo.findOne(productId, {
      relations: ['categories'],
    });
    const category = await this.categoryRepo.findOne(categoryId);
    product.categories.push(category);

    return this.productRepo.save(product);
  }
}
