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
import { GetPrimaryMetaData, PrimaryMetaData } from 'src/users/user.decorator';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-keys.dto';
import { GetApiKeysDto } from './dto/get-api-keys.dto';
import { ApiKey } from './entities/api-key.entity';

@ApiBearerAuth()
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @GetPrimaryMetaData() primaryMetaData: PrimaryMetaData,
  ) {
    return this.apiKeysService.create({
      ...createApiKeyDto,
      user: primaryMetaData.user,
    });
  }

  @Get()
  findAll(@Query() query: GetApiKeysDto) {
    return this.apiKeysService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiKeysService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() apiKey: ApiKey) {
    return this.apiKeysService.update(id, apiKey);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiKeysService.remove(id);
  }
}
