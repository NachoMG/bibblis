import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  newPasswordConfirm: string;
}
