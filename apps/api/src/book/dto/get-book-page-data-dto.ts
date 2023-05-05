import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetBookPagaDataDto {
  @ApiProperty({
    description: 'Book ID',
  })
  @IsUUID()
  id: string;
}
