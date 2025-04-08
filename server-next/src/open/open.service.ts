import { Injectable } from '@nestjs/common';
import { CreateOpenDto } from './dto/create-open.dto';
import { UpdateOpenDto } from './dto/update-open.dto';

@Injectable()
export class OpenService {
  create(createOpenDto: CreateOpenDto) {
    return 'This action adds a new open';
  }

  findAll() {
    return `This action returns all open`;
  }

  findOne(id: number) {
    return `This action returns a #${id} open`;
  }

  update(id: number, updateOpenDto: UpdateOpenDto) {
    return `This action updates a #${id} open`;
  }

  remove(id: number) {
    return `This action removes a #${id} open`;
  }
}
