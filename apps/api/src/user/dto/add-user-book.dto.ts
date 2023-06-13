import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddUserBookDto {
  @ApiProperty({
    description: 'Book ID',
  })
  @IsUUID()
  bookId: string;
}
