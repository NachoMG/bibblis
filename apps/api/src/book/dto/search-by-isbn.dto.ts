import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchByIsbnDto {
  @ApiProperty({
    description: 'ISBN-10 or ISBN-13',
    example: '9783161484100',
  })
  @IsString()
  isbn: string;
}
