import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CriteriaOrWhereOptions,
  entityFindAllByPaging,
} from 'src/commons/query.utils';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateApiDto } from './dto/create-api.dto';
import { GetApisDto } from './dto/get-apis.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { Api } from './entities/api.entity';

@Injectable()
export class ApisService {
  constructor(
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
  ) {}

  create(createApiDto: CreateApiDto) {
    return this.apiRepository.save(this.apiRepository.create(createApiDto));
  }
  findAll(getApisDto: GetApisDto) {
    return entityFindAllByPaging(this.apiRepository, {
      ...getApisDto,
    });
  }

  findOne(
    criteriaOrWhereOptions: CriteriaOrWhereOptions<Api>,
    findOneOptions?: FindOneOptions<Api>,
  ) {
    return this.apiRepository.findOne({
      ...findOneOptions,
      where:
        typeof criteriaOrWhereOptions === 'string'
          ? {
              id: criteriaOrWhereOptions,
            }
          : criteriaOrWhereOptions,
    });
  }

  update(
    criteriaOrWhereOptions: CriteriaOrWhereOptions<Api>,
    partialEntity: UpdateApiDto,
  ) {
    return this.apiRepository.update(criteriaOrWhereOptions, partialEntity);
  }

  remove(criteriaOrWhereOptions: CriteriaOrWhereOptions<Api>) {
    return this.apiRepository.softDelete(criteriaOrWhereOptions);
  }
}
