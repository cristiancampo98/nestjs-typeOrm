import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

export abstract class Generic<Entity, Id, Dto, PartialDto> {
  private _titleEntity = 'Item';
  constructor(private readonly genericRepository: Repository<Entity>) {}

  public getTitleEntity() {
    return this._titleEntity;
  }
  public setTitleEntity(value) {
    this._titleEntity = value;
  }

  async findOne(id: Id): Promise<Entity> {
    const item = await this.genericRepository.findOne(id);
    if (!item) {
      throw new NotFoundException(`${this.getTitleEntity()} #${id} not found`);
    }
    return item;
  }
  findAll(): Promise<Entity[]> {
    return this.genericRepository.find();
  }
  async create(data: Dto): Promise<Entity> {
    try {
      const newItem = this.genericRepository.create(data);
      await this.genericRepository.save(newItem);
      return newItem;
    } catch (error) {
      throw new InternalServerErrorException(error.detail);
    }
  }
  async update(id: Id, data: PartialDto): Promise<Entity> {
    const item = await this.findOne(id);
    this.genericRepository.merge(item, data);
    return this.genericRepository.save(item);
  }
  async remove(id: Id): Promise<boolean> {
    await this.findOne(id);
    await this.genericRepository.delete(id);
    return true;
  }
}
