import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';
import { Generic } from 'src/common/generic.service';

@Injectable()
export class BrandsService extends Generic<
  Brand,
  number,
  CreateBrandDto,
  UpdateBrandDto
> {
  constructor(@InjectRepository(Brand) private brandRepo: Repository<Brand>) {
    super(brandRepo);
    this.setTitleEntity('Brand');
  }

  findOne(id: number) {
    const item = this.brandRepo.findOne(id, {
      relations: ['products'],
    });
    if (!item) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return item;
  }
}
