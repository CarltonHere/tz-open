import { PartialType } from '@nestjs/swagger';
import { CreateCherryDto } from './create-cherry.dto';

export class UpdateCherryDto extends PartialType(CreateCherryDto) {}
