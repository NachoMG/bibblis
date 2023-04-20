import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenService {
  constructor(private prismaService: PrismaService) {}

  findOne(query: Prisma.RefreshTokenWhereUniqueInput) {
    return this.prismaService.refreshToken.findUnique({ where: query });
  }
  
  insert(refreshToken: Prisma.RefreshTokenUncheckedCreateInput) {
    return this.prismaService.refreshToken.create({ data: refreshToken });
  }

  delete(query: Prisma.RefreshTokenWhereUniqueInput) {
    return this.prismaService.refreshToken.delete({ where: query })
  }

}
