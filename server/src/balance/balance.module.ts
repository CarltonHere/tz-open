import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Balance, User])],
  controllers: [BalanceController],
  providers: [BalanceService, UserService],
  exports: [BalanceService],
})
export class BalanceModule {}
