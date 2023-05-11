import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEmail, IsString, Length, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'me@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'me@example.com',
  })
  @IsEmail()
  emailConfirm: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  passwordConfirm: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  acceptedMarketing: boolean;

  @ApiProperty({
    example: 'en',
  })
  @IsString()
  @Length(2)
  lang: string;

  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    example: '1980-01-01',
  })
  @IsDateString()
  birthDate: string;

}
