import { Controller, Get, Param } from '@nestjs/common';

import { BookService } from './book.service';
import { SearchByIsbnDto } from './dto/search-by-isbn.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('search/:isbn')
  searchByIsbn(@Param() searchByIsbnDto: SearchByIsbnDto) {
    return this.bookService.searchByIsbn(searchByIsbnDto);
  }
}
