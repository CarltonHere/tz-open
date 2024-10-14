import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLE } from './user.constant';
import { GetUser } from './user.decorator';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @SetMetadata('Roles', [ROLE.Admin])
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('current')
  getCurrentUser(@GetUser() user) {
    return this.userService.findOne(user.id);
  }

  @Get()
  @SetMetadata('Roles', [ROLE.Admin])
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @SetMetadata('Roles', [ROLE.Admin])
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
