import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @ApiProperty({
    description: 'Which page to fetch',
    default: 1,
  })
  page: number;

  @IsOptional()
  @ApiProperty({
    description: 'Records per page',
    default: 100,
  })
  limit: number;
}
