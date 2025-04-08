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
import { GetPermissionDto } from './dto/get-permission.dto';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  @Post()
  create(@Body() permission: Permission) {
    return this.permissionsService.create(permission);
  }

  @Get()
  findAll(@Query() query: GetPermissionDto) {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() permission: Permission) {
    return this.permissionsService.update(id, permission);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Get('service')
  findAllServices() {
    return this.permissionsService.findAllServices();
  }
}
