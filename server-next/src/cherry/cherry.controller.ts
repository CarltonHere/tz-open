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
  findConfigBaseInfo() {
    return {
      id: 'b82f0262',
    };
  }

  @Get(':id')
  findTargetConfig(
    @Param('id') id: string,
    @Req() clientRequest: FastifyRequest & { _parsedUrl: { pathname: string } },
  ) {
    // 获取header里的token
    const _token = clientRequest.headers.authorization;
    const token = _token?.split(' ')[1];

    if (id === 'provider') {
      return [
        {
          id: 'bakertilly',
          name: '天职国际',
          type: 'openai',
          apiKey: token,
          apiHost: 'https://api.tzcpa.com/origin/bailian/compatible-mode/v1/',
          models: [
            {
              id: 'qwen-turbo-latest',
              name: 'qwen-turbo-latest',
              provider: 'bakertilly',
              group: 'qwen-turbo',
              owned_by: 'system',
            },
            {
              id: 'qwen-plus-latest',
              name: 'qwen-plus-latest',
              provider: 'bakertilly',
              group: 'qwen-plus',
              owned_by: 'system',
            },
            {
              id: 'qwen-max-latest',
              name: 'qwen-max-latest',
              provider: 'bakertilly',
              group: 'qwen-max',
              owned_by: 'system',
            },
            {
              id: 'qwen-vl-plus',
              name: 'qwen-vl-plus',
              provider: 'bakertilly',
              group: 'qwen-vl',
              owned_by: 'system',
            },
            {
              id: 'qwen-coder-plus',
              name: 'qwen-coder-plus',
              provider: 'bakertilly',
              group: 'qwen-coder',
              owned_by: 'system',
            },
            {
              id: 'gte-rerank-v2',
              name: 'gte-rerank-v2',
              provider: 'bakertilly',
              group: 'gte-rerank',
              owned_by: 'system',
            },
            {
              id: 'multimodal-embedding-v1',
              name: 'multimodal-embedding-v1',
              provider: 'bakertilly',
              group: 'multimodal-embedding',
              owned_by: 'system',
            },
            {
              id: 'text-embedding-v1',
              name: 'text-embedding-v1',
              provider: 'bakertilly',
              group: 'text-embedding',
              owned_by: 'system',
            },
            {
              id: 'text-embedding-v2',
              name: 'text-embedding-v2',
              provider: 'bakertilly',
              group: 'text-embedding',
              owned_by: 'system',
            },
            {
              id: 'text-embedding-v3',
              name: 'text-embedding-v3',
              provider: 'bakertilly',
              group: 'text-embedding',
              owned_by: 'system',
            },
            {
              id: 'qwen3-235b-a22b',
              name: 'qwen3-235b-a22b',
              provider: 'bakertilly',
              group: 'qwen3-moe',
              owned_by: 'system',
            },
            {
              id: 'qwen3-30b-a3b',
              name: 'qwen3-30b-a3b',
              provider: 'bakertilly',
              group: 'qwen3-moe',
              owned_by: 'system',
            },
            {
              id: 'deepseek-r1',
              name: 'deepseek-r1',
              provider: 'bakertilly',
              group: 'deepseek',
              owned_by: 'system',
            },
            {
              id: 'deepseek-v3',
              name: 'deepseek-v3',
              provider: 'bakertilly',
              group: 'deepseek',
              owned_by: 'system',
            },
          ],
          isSystem: true,
          enabled: true,
        },
      ];
    }
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
