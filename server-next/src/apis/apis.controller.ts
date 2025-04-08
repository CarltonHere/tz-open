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
import { ApisService } from './apis.service';
import { CreateApiDto } from './dto/create-api.dto';
import { GetApisDto } from './dto/get-apis.dto';
import { UpdateApiDto } from './dto/update-api.dto';

@ApiBearerAuth()
@Controller('apis')
export class ApisController {
  constructor(private readonly apisService: ApisService) {}

  @Post()
  create(@Body() createApiDto: CreateApiDto) {
    return this.apisService.create(createApiDto);
  }

  @Get()
  findAll(@Query() query: GetApisDto) {
    return this.apisService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apisService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiDto: UpdateApiDto) {
    return this.apisService.update(id, updateApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apisService.remove(id);
  }
}
