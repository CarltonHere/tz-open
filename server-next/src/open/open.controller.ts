import {
  All,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from 'src/users/entities/user.entity';
import { CreateOpenDto } from './dto/create-open.dto';
import { UpdateOpenDto } from './dto/update-open.dto';
import { OpenService } from './open.service';

@ApiBearerAuth()
@Controller(['open', 'origin'])
export class OpenController {
  constructor(private readonly openService: OpenService) {}

  @Post()
  create(@Body() createOpenDto: CreateOpenDto) {
    return this.openService.create(createOpenDto);
  }

  @Get()
  findAll() {
    return this.openService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.openService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOpenDto: UpdateOpenDto) {
    return this.openService.update(+id, updateOpenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.openService.remove(+id);
  }

  @All(':apiName/*')
  @ApiParam({ name: 'apiName', example: 'tyc' })
  async proxy(
    @Req()
    clientRequest: FastifyRequest & {
      _parsedUrl: { pathname: string };
      user: User;
    },
    @Res() clientResponse: FastifyReply,
  ): Promise<void> {
    const userSymbol = (
      clientRequest.params as {
        apiName: string;
      }
    ).apiName;

    await this.openService.proxyRequest(
      clientRequest,
      clientResponse,
      userSymbol,
    );
  }
}
