import { ApiProperty } from '@nestjs/swagger';

export enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

export class CommonApiResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty()
  total?: number;

  @ApiProperty()
  current?: number;

  @ApiProperty()
  pageSize?: number;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  path?: string;

  @ApiProperty({ example: 200 })
  errorCode?: number;

  @ApiProperty({ example: 'success' })
  errorMessage?: string;

  @ApiProperty()
  showType?: ErrorShowType;

  constructor(payload: {
    data: T;
    total?: number;
    current?: number;
    pageSize?: number;
    path?: string;
    timestamp?: number;
    success?: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: ErrorShowType;
  }) {
    Object.assign(this, payload);
    this.timestamp = payload.timestamp || new Date().getTime();
    this.success =
      typeof payload.success === 'boolean'
        ? payload.success
        : payload.errorCode
          ? false
          : true;
  }
}
