import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/user/user.decorator';
import { GetApiKeyDto } from './dto/get-api-key.dto';

@ApiBearerAuth()
@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(@Body() createApiKeyDto: CreateApiKeyDto, @GetUser() user: User) {
    return this.apiKeyService.create(createApiKeyDto, user);
  }

  @Get()
  findAll(@GetUser() user: User, @Query() query: GetApiKeyDto) {
    return this.apiKeyService.findAll(user, query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.apiKeyService.findOne({
      id,
    });
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateApiKeyDto: UpdateApiKeyDto) {
    return this.apiKeyService.update(id, updateApiKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiKeyService.remove(+id);
  }
}
