import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

enum LOAN_STATUS {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ApproveLoanDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ type: String, required: true, description: 'Loan id' })
  loan_id: string;

  @IsNotEmpty()
  @IsEnum(LOAN_STATUS)
  @ApiProperty({ type: String, required: true, description: 'Loan status' })
  status: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, description: 'Comment' })
  comment: string;
}
