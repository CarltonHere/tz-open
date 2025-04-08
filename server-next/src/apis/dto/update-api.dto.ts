import { PartialType } from '@nestjs/swagger';
import { Api } from '../entities/api.entity';

export class UpdateApiDto extends PartialType(Api) {}
