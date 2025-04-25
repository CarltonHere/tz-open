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
import { User } from 'src/users/entities/user.entity';
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
      owner: {
        id: primaryMetaData.user.id,
      } as unknown as User,
    });
  }

  @Get()
  findAll(
    @Query() query: GetApiKeysDto,
    @GetPrimaryMetaData() primaryMetaData: PrimaryMetaData,
  ) {
    return this.apiKeysService.findAll(
      injectPrimaryMetaData(query, primaryMetaData),
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetPrimaryMetaData() primaryMetaData: PrimaryMetaData,
  ) {
    return this.apiKeysService.findOne(
      injectPrimaryMetaData(
        {
          id,
        },
        primaryMetaData,
      ),
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() apiKey: ApiKey,
    @GetPrimaryMetaData() primaryMetaData: PrimaryMetaData,
  ) {
    return this.apiKeysService.update(
      injectPrimaryMetaData(
        {
          id,
        },
        primaryMetaData,
      ),
      apiKey,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetPrimaryMetaData() primaryMetaData: PrimaryMetaData,
  ) {
    return this.apiKeysService.remove(
      injectPrimaryMetaData(
        {
          id,
        },
        primaryMetaData,
      ),
    );
  }
}
