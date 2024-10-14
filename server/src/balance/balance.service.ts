import { Injectable, Logger } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
    private readonly userService: UserService,
  ) {}
  create(createBalanceDto: CreateBalanceDto) {
    this.logger.log('创建余额账户', createBalanceDto);
    return this.balanceRepository.save(createBalanceDto);
  }

  findOne(user: User) {
    return this.balanceRepository.findOne({
      where: {
        user,
      },
    });
  }

  async verifyAmount(change: number, user: User) {
    let balance = await this.balanceRepository.findOne({
      where: {
        user,
      },
    });
    if (!balance) {
      this.logger.log('用户不存在余额账户', user);
      balance = await this.create({
        amount: 0,
        user,
      });
    }
    return Number(balance.amount) + change >= 0;
  }

  async chargeAmount(change: number, user: User) {
    const balance = await this.balanceRepository.findOne({
      where: {
        user,
      },
    });
    balance.amount = Number(balance.amount) + change;
    return this.balanceRepository.save(balance);
  }
}
