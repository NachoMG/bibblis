import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BookService } from './book.service';
import { SearchByIsbnDto } from './dto/search-by-isbn.dto';
import { GetBookPagaDataDto } from './dto/get-book-page-data-dto';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @ApiOperation({ summary: 'Search a book by its ISBN identifier' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
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

  @ApiOperation({ summary: 'Returns needed data for rendering book page' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @Get('latest')
  getLatestBooks() {
    return this.bookService.findMany({ limit: 12, sort: { createdAt: 'desc' } });
  }
}
