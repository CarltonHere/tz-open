import { Controller, Post, Body, Get, SetMetadata } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { GetUser } from 'src/user/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLE } from 'src/user/user.constant';

@ApiBearerAuth()
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  @SetMetadata('Roles', [ROLE.Admin])
  create(@Body() createBalanceDto: CreateBalanceDto) {
    return this.balanceService.create(createBalanceDto);
  }

  @Get('current')
  getCurrentUserBalance(@GetUser() user) {
    return this.balanceService.findOne(user);
  }
}
