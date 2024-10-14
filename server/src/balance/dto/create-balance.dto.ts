import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateBalanceDto {
  @ApiProperty({
    description: '充值额度',
    example: '100',
  })
  @IsNotEmpty({ message: '充值额度不能为空' })
  @IsNumber({}, { message: '充值额度格式错误' })
  amount: number;

  @IsOptional()
  user: User;
}
