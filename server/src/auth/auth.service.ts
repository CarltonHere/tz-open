import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { GetAuthDto } from './dto/get-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}
  createAuthLog(createAuthDto: CreateAuthDto) {
    return this.authRepository.save(createAuthDto);
  }
  async findAll(
    user: User,
    { current = 1, pageSize = 10, ...entity }: GetAuthDto,
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
    const [data, total] = await this.authRepository.findAndCount({
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
}
