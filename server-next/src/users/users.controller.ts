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
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUsersDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetPrimaryMetaData, PrimaryMetaData } from './user.decorator';
import { UsersService } from './users.service';

@ApiBearerAuth()
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
