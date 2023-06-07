import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PasswordResetService {
  constructor (private prismaService: PrismaService) {}

  findOne(query: Prisma.PasswordResetWhereUniqueInput) {
    return this.prismaService.passwordReset.findUnique({ where: query });
  }

  findFirst(query: Prisma.PasswordResetWhereInput) {
    return this.prismaService.passwordReset.findFirst({ where: query });
  }

  insert(passwordReset: Prisma.PasswordResetUncheckedCreateInput) {
    return this.prismaService.passwordReset.create({ data: passwordReset });
  }

  updateMany(query: Prisma.PasswordResetWhereInput, modifier: Prisma.PasswordResetUpdateInput) {
    return this.prismaService.passwordReset.updateMany({
      where: query,
      data: modifier,
    });
  }
}
