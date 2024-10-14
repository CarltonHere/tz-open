import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty()
  data: T;
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 1701221935273 })
  timestamp: number;

  @ApiProperty({ example: 'success' })
  message?: string;

  @ApiProperty({ example: '/auth/sso' })
  path?: string;

  constructor(
    data: T,
    code: number,
    path: string = '',
    message: string = 'Success',
    timestamp: number = new Date().getTime(),
  ) {
    this.data = data;
    this.code = code;
    this.timestamp = timestamp;
    this.message = message;
    this.path = path;
  }
}
