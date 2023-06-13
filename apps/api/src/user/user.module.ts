import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { UserBookModule } from '../user-book/user-book.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, UserBookModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
