import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos';
import { Generic } from 'src/common/generic.service';

@Injectable()
export class CategoriesService extends Generic<
  Category,
  number,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {
    super(categoryRepo);
    this.setTitleEntity('Category');
  }
}
