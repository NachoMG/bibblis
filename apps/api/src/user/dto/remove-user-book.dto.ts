import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveUserBookDto {
  @ApiProperty({
    description: 'Book ID',
  })
  @IsUUID()
  bookId: string;
}
