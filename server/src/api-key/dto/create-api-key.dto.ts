import { ApiKey } from '../entities/api-key.entity';
import { PartialType } from '@nestjs/swagger';

export class CreateApiKeyDto extends PartialType(ApiKey) {}
