import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { BookService } from './book.service';
import { SearchByIsbnDto } from './dto/search-by-isbn.dto';
import { GetBookPagaDataDto } from './dto/get-book-page-data-dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('search/:isbn')
  searchByIsbn(@Param() searchByIsbnDto: SearchByIsbnDto) {
    return this.bookService.searchByIsbn(searchByIsbnDto);
  }

  @ApiOperation({ summary: 'Returns needed data for rendering book page' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @Get('page-data/:id')
  getBookPageData(@Param() getBookPageDataDto: GetBookPagaDataDto) {
    return this.bookService.getBookPageData(getBookPageDataDto);
  }
}
