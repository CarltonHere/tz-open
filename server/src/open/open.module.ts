import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from 'src/api-key/entities/api-key.entity';
import { ApiService } from 'src/api/api.service';
import { Api } from 'src/api/entities/api.entity';
import { BalanceService } from 'src/balance/balance.service';
import { Balance } from 'src/balance/entities/balance.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Open } from './entities/open.entity';
import { OpenController } from './open.controller';
import { OpenService } from './open.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Balance, User, Api, Open, ApiKey]),
    HttpModule,
  ],
  controllers: [OpenController],
  providers: [OpenService, BalanceService, UserService, ApiService],
})
export class OpenModule {}
