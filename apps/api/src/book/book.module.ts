import { Module } from '@nestjs/common';

import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BookApiModule } from '../book-api/book-api.module';
import { WorkModule } from '../work/work.module';

@Module({
  imports: [PrismaModule, BookApiModule, WorkModule],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
