import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetUserBookDto {
  @ApiProperty({
    description: 'Book ID',
  })
  @IsUUID()
  bookId: string;
}
