import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUsersDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetUser } from './user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Get()
  findAll(@Query() query: GetUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersDto: UpdateUsersDto) {
    return this.usersService.update(id, updateUsersDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('current')
  findCurrent(@GetUser() user: User) {
    console.log(user);
    return this.findOne(user.id as string);
  }

  @Patch('current')
  updateCurrent(@GetUser() user: User, @Body() updateUsersDto: UpdateUsersDto) {
    return this.usersService.update(user.id as string, updateUsersDto);
  }
}
