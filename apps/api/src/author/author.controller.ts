import { Controller, Get, Param } from '@nestjs/common';

import { AuthorService } from './author.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAuthorPageDataDto } from './dto/get-author-page-data-dto';

@Controller('author')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @ApiOperation({ summary: 'Returns needed data for rendering author page' })
  @ApiResponse({ status: 200, description: 'Author found' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  @Get('page-data/:id')
  getAuthorPageData(@Param() getAuthorPageDataDto: GetAuthorPageDataDto) {
    return this.authorService.getAuthorPageData(getAuthorPageDataDto);
  }
}
