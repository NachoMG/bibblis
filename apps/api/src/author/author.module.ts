import { Module } from '@nestjs/common';

import { AuthorService } from './author.service';
import { BookApiModule } from '../book-api/book-api.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, BookApiModule],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
