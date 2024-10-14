import { Injectable, Logger } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Api } from './entities/api.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  constructor(
    @InjectRepository(Api) private readonly apiRepository: Repository<Api>,
  ) {}
  create(createApiDto: CreateApiDto) {
    return this.apiRepository.save(createApiDto);
  }

  async findOne(symbol: string, select = []) {
    return this.apiRepository.findOne({
      where: { symbol },
      cache: 10000,
      select,
    });
  }
}
