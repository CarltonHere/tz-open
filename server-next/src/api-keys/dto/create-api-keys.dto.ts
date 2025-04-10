import { OmitType } from '@nestjs/swagger';
import { ApiKey } from '../entities/api-key.entity';

export class CreateApiKeyDto extends OmitType(ApiKey, ['status']) {}
