import { Module } from '@nestjs/common';
import { CherryService } from './cherry.service';
import { CherryController } from './cherry.controller';

@Module({
  controllers: [CherryController],
  providers: [CherryService],
})
export class CherryModule {}
