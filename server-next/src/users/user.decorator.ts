import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PERMISSION_STRATEGY } from 'src/permissions/entities/permission.entity';
import { User } from './entities/user.entity';

export type PrimaryMetaData = {
  type: PERMISSION_STRATEGY;
  user: User;
  jti: string | undefined;
};
export const GetPrimaryMetaData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PrimaryMetaData => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      type: request?.permission?.strategy ?? PERMISSION_STRATEGY.GLOBAL,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      user: request.user,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      jti: request.jti,
    };
  },
);
