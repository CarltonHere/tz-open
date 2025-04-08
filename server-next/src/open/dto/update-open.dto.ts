import { PartialType } from '@nestjs/swagger';
import { CreateOpenDto } from './create-open.dto';

export class UpdateOpenDto extends PartialType(CreateOpenDto) {}
