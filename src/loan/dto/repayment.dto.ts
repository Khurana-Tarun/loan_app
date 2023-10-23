import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class RepaymentDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Loan Id',
  })
  loan_id: string;

  @IsNotEmpty()
  @Min(1)
  @ApiProperty({
    description: 'Payment Amount',
  })
  amount: number;
}
