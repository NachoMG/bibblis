import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserBookService {
  constructor(private prismaService: PrismaService) {}
  
  findOne(query: Prisma.UserBookWhereUniqueInput) {
    return this.prismaService.userBook.findUnique({ where: query });
  }

  insert({ userId, bookId }: { userId: string, bookId: string }) {
    return this.prismaService.userBook.create({
      data: {
        book: {
          connect: { id: bookId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  remove({ userId, bookId }: { userId: string, bookId: string }) {
    return this.prismaService.userBook.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        }
      }
    });
  }
}
