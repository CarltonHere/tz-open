import { Module } from '@nestjs/common';
import { OpenService } from './open.service';
import { OpenController } from './open.controller';
import { BalanceService } from 'src/balance/balance.service';
import { OpenQueue } from './open.queue';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from 'src/balance/entities/balance.entity';
import { UserService } from 'src/user/user.service';
import { HttpModule } from '@nestjs/axios';
import { User } from 'src/user/entities/user.entity';
import { ApiService } from 'src/api/api.service';
import { Api } from 'src/api/entities/api.entity';
import { Open } from './entities/open.entity';
import { ApiKey } from 'src/api-key/entities/api-key.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Balance, User, Api, Open, ApiKey]),
    HttpModule,
  ],
  controllers: [OpenController],
  providers: [OpenService, BalanceService, OpenQueue, UserService, ApiService],
})
export class OpenModule {}
