import { All, Controller, Req, Res } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from 'src/users/entities/user.entity';
import { OpenService } from './open.service';

/**
 * MCPS 控制器
 * 将 /api/v1/mcps 路由映射到 amcp API
 */
@ApiBearerAuth()
@Controller('api/v1/mcps')
export class McpsController {
  constructor(private readonly openService: OpenService) {}

  @All('*')
  async proxy(
    @Req()
    clientRequest: FastifyRequest & {
      _parsedUrl: { pathname: string };
      user: User;
    },
    @Res() clientResponse: FastifyReply,
  ): Promise<void> {
    // 将所有 /mcps 请求映射到 amcp
    await this.openService.proxyRequest(
      clientRequest,
      clientResponse,
      'amcp',
      'mcps',
    );
  }
}
