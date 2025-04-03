import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { MurLock } from 'murlock';
import { BalanceService } from 'src/balance/balance.service';
import { User } from 'src/user/entities/user.entity';
import { Between, In, Like, Repository } from 'typeorm';
import { CreateOpenDto } from './dto/create-open.dto';
import { GetOpenDto } from './dto/get-auth.dto';
import { Open } from './entities/open.entity';

@Injectable()
export class OpenService {
  private readonly logger = new Logger(OpenService.name);
  constructor(
    private readonly balanceService: BalanceService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Open)
    private readonly openRepository: Repository<Open>,
  ) {}

  async verifyCharge(amount: number, user: User) {
    return this.balanceService.verifyAmount(amount, user);
  }

  @MurLock(
    5000,
    (retries) => (Math.floor(Math.random() * 50) + 50) * retries,
    'user.id',
  )
  async payCharge(amount: number, user: User) {
    const res = await this.balanceService.chargeAmount(amount, user);
    return res;
  }
  async request(symbol, config) {
    const hash = createHash('sha256');
    hash.update(JSON.stringify(config));
    const hashValue = hash.digest('hex');
    const res = await this.cacheManager.get(hashValue);
    this.logger.verbose(`symbol: ${symbol}`, config);
    if (res) {
      this.logger.log('重复请求，切换至缓存');
      return res;
    }
    // res = await this.apiQueueService.addJob(symbol, {
    //   symbol,
    //   config,
    // });
    this.cacheManager.set(hashValue, res, 60 * 60 * 1000);
    return res;
  }

  async createOpenLog(createOpenDto: CreateOpenDto) {
    const startOfHour = new Date();
    startOfHour.setMinutes(0, 0, 0);

    const endOfHour = new Date();
    endOfHour.setMinutes(59, 59, 999);

    const existingLog = await this.openRepository.findOne({
      where: {
        create_time: Between(startOfHour, endOfHour),
        user: createOpenDto.user,
        path: createOpenDto.path,
        api: {
          id: createOpenDto.api.id,
        },
        api_key: createOpenDto.api_key
          ? {
              id: createOpenDto.api_key.id,
            }
          : undefined,
      },
    });
    if (existingLog) {
      existingLog.cost = Number(existingLog.cost) + createOpenDto.cost;
      existingLog.count = Number(existingLog.count) + createOpenDto.count;
      existingLog.billCount =
        Number(existingLog.billCount) + createOpenDto.billCount;
      return this.openRepository.save(existingLog);
    } else {
      return this.openRepository.save(createOpenDto);
    }
  }

  async findAll(
    user: User,
    { current = 1, pageSize = 10, ...entity }: GetOpenDto,
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
    const [data, total] = await this.openRepository.findAndCount({
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
