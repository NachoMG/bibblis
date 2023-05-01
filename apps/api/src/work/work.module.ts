import { Module } from '@nestjs/common';

import { AuthorModule } from '../author/author.module';
import { BookApiModule } from '../book-api/book-api.module';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkService } from './work.service';

@Module({
  imports: [AuthorModule, BookApiModule, PrismaModule],
  providers: [WorkService],
  exports: [WorkService],
})
export class WorkModule {}
