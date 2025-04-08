import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApisModule } from 'src/apis/apis.module';
import { OpenController } from './open.controller';
import { OpenService } from './open.service';

@Module({
  imports: [ApisModule, HttpModule],
  controllers: [OpenController],
  providers: [OpenService],
})
export class OpenModule {}
