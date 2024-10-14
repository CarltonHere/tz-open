import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKey } from './entities/api-key.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { GetApiKeyDto } from './dto/get-api-key.dto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}
  create(createApiKeyDto: CreateApiKeyDto, user: User) {
    // user 强制设置为当前用户
    createApiKeyDto.user = user;
    return this.apiKeyRepository.save(createApiKeyDto);
  }

  async findAll(
    user: User,
    { current = 1, pageSize = 10, ...entity }: GetApiKeyDto,
  ) {
    for (const i in entity) {
      if (entity[i]) {
        if (Array.isArray(entity[i])) {
          if (String(i).includes('time')) {
            entity[i] = Between(entity[i][0], entity[i][1]);
          } else {
            entity[i] = In(entity[i]);
          }
        }
        // 判断是否是字符串
        if (typeof entity[i] === 'string') {
          entity[i] = Like(`%${entity[i]}%`);
        }
      } else {
        entity[i] = undefined;
      }
    }
    const [data, total] = await this.apiKeyRepository.findAndCount({
      where: {
        user,
        ...entity,
      },
      take: pageSize,
      skip: (current - 1) * pageSize,
    });
    return {
      data: { data, current, pageSize, total },
    };
  }

  findOne(apiKey: ApiKey) {
    return this.apiKeyRepository.findOne({
      where: apiKey,
      relations: ['user'],
    });
  }

  update(id: number, updateApiKeyDto: UpdateApiKeyDto) {
    return this.apiKeyRepository.update(id, updateApiKeyDto);
  }

  remove(id: number) {
    return this.apiKeyRepository.softDelete(id);
  }
}
