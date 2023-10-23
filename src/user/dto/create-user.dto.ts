import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, description: 'Username' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, description: 'Username' })
  password: string;
}
