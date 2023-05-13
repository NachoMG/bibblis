import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  findOne(query: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({ where: query });
  }

  async insert(user: Prisma.UserCreateInput) {
    return this.prismaService.user.create({ data: user });
  }

  updateOne(update: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(update);
  }
}
