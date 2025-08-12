import { Injectable } from '@nestjs/common';
import { CreateCherryDto } from './dto/create-cherry.dto';
import { UpdateCherryDto } from './dto/update-cherry.dto';

@Injectable()
export class CherryService {
  create(createCherryDto: CreateCherryDto) {
    return 'This action adds a new cherry';
  }

  findAll() {
    return `This action returns all cherry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cherry`;
  }

  update(id: number, updateCherryDto: UpdateCherryDto) {
    return `This action updates a #${id} cherry`;
  }

  remove(id: number) {
    return `This action removes a #${id} cherry`;
  }
}
