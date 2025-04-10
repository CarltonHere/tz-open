import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CriteriaOrWhereOptions,
  entityFindAllByPaging,
} from 'src/commons/query.utils';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateApiKeyDto } from './dto/create-api-keys.dto';
import { GetApiKeysDto } from './dto/get-api-keys.dto';
import { ApiKey } from './entities/api-key.entity';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeysRepository: Repository<ApiKey>,
  ) {}
  create(createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeysRepository.save(createApiKeyDto);
  }

  findAll(getApisDto: GetApiKeysDto) {
    return entityFindAllByPaging(this.apiKeysRepository, {
      ...getApisDto,
    });
  }

  findOne(
    criteriaOrWhereOptions: CriteriaOrWhereOptions<ApiKey>,
    findOneOptions?: FindOneOptions<ApiKey>,
  ) {
    return this.apiKeysRepository.findOne({
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
    criteriaOrWhereOptions: CriteriaOrWhereOptions<ApiKey>,
    partialEntity: ApiKey,
  ) {
    return this.apiKeysRepository.update(criteriaOrWhereOptions, partialEntity);
  }

  remove(criteriaOrWhereOptions: CriteriaOrWhereOptions<ApiKey>) {
    return this.apiKeysRepository.softDelete(criteriaOrWhereOptions);
  }
}
