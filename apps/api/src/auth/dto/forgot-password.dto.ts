import { ApiProperty } from '@nestjs/swagger';

import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'me@example.com',
  })
  @IsEmail()
  email: string;
}
