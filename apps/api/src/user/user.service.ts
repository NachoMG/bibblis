import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { UserBookService } from '../user-book/user-book.service';

@Injectable()
export class UserService {
  constructor
  (
    private prismaService: PrismaService,
    private userBookService: UserBookService,
  ) {}

  findOne(query: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({ where: query });
  }

  async insert(user: Prisma.UserCreateInput) {
    return this.prismaService.user.create({ data: user });
  }

  updateOne(update: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(update);
  }

  async getUserBook({ userId, bookId }: { userId: string, bookId: string }) {
    const userBook = await this.userBookService.findOne({
      userId_bookId: {
        userId,
        bookId,
      },
    });

    if (!userBook) {
      throw new NotFoundException();
    }
  }

  addUserBook({ userId, bookId }: { userId: string, bookId: string }) {
    return this.userBookService.insert({ userId, bookId });
  }

  removeUserBook({ userId, bookId }: { userId: string, bookId: string }) {
    return this.userBookService.remove({ userId, bookId });
  }

}
