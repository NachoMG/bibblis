import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'me@example.com',
  })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  password: string;
}
