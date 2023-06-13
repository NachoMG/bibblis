import { Module } from '@nestjs/common';

import { UserBookService } from './user-book.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserBookService],
  exports: [UserBookService],
})
export class UserBookModule {}
