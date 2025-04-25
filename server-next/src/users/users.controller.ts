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
import { ApiBearerAuth } from '@nestjs/swagger';
import { injectPrimaryMetaData } from 'src/permissions/permission.util';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUsersDto } from './dto/update-user.dto';
import { GetPrimaryMetaData, PrimaryMetaData } from './user.decorator';
import { UsersService } from './users.service';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() query: GetUsersDto,
    @GetPrimaryMetaData() primaryMetaData: PrimaryMetaData,
  ) {
    return this.usersService.findAll(
      injectPrimaryMetaData(query, primaryMetaData, 'id'),
    );
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
  findCurrent(@GetPrimaryMetaData() primaryMetaData: PrimaryMetaData) {
    console.log(primaryMetaData);
    return this.findOne(primaryMetaData.user.id as string);
  }

  @Patch('current')
  updateCurrent(
    @GetPrimaryMetaData() primaryMetaData: PrimaryMetaData,
    @Body() updateUsersDto: UpdateUsersDto,
  ) {
    return this.usersService.update(
      primaryMetaData.user.id as string,
      updateUsersDto,
    );
  }
}
