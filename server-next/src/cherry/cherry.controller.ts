import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { CherryService } from './cherry.service';
import getConfigs from './configs';
import { CreateCherryDto } from './dto/create-cherry.dto';
import { UpdateCherryDto } from './dto/update-cherry.dto';

@Controller('cherry')
export class CherryController {
  constructor(private readonly cherryService: CherryService) {}

  @Post()
  create(@Body() createCherryDto: CreateCherryDto) {
    return this.cherryService.create(createCherryDto);
  }

  @Get()
  findAll(
    @Req() clientRequest: FastifyRequest & { _parsedUrl: { pathname: string } },
  ) {
    // 获取header里的token
    const _token = clientRequest.headers.authorization;
    const token = _token?.split(' ')[1];
    const _config = getConfigs(token as string);
    return _config;
  }

  @Get(':id')
  findTargetConfig(
    @Param('id') id: string,
    @Req() clientRequest: FastifyRequest & { _parsedUrl: { pathname: string } },
  ) {
    // 获取header里的token
    const _token = clientRequest.headers.authorization;
    const token = _token?.split(' ')[1];
    const _config = getConfigs(token as string);
    if (_config?.[id]) {
      return _config?.[id as keyof typeof _config];
    }
    return {};
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCherryDto: UpdateCherryDto) {
    return this.cherryService.update(+id, updateCherryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cherryService.remove(+id);
  }
}
