import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min, IsEnum } from 'class-validator';
import { PERIODICITY } from 'src/postgres/entity/loan.entity';

export class CreateLoanDto {
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({
    description: 'Loan amount',
    default: 1,
  })
  amount: number;

  @IsNotEmpty()
  @IsEnum(PERIODICITY)
  @ApiProperty({
    description: 'Periodicity',
    default: 'WEEKLY',
  })
  periodicity: string;

  @IsNotEmpty()
  @Min(2)
  @ApiProperty({
    description: 'Total EMIs',
    default: 6,
  })
  total_emis: number;

  @ApiProperty({
    description: 'Description',
    default: 'Perosnal use',
  })
  description: string;
}
