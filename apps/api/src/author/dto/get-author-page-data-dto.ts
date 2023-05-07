import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetAuthorPageDataDto {
  @ApiProperty({
    description: 'Author ID',
  })
  @IsUUID()
  id: string;
}
