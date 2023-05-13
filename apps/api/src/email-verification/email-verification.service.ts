import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailVerificationService {
  constructor(private prismaService: PrismaService) {}

  findOne(query: Prisma.EmailVerificationWhereUniqueInput) {
    return this.prismaService.emailVerification.findUnique({ where: query });
  }
  
  insert(emailVerification: Prisma.EmailVerificationUncheckedCreateInput) {
    return this.prismaService.emailVerification.create({
      data: emailVerification,
    });
  }

  delete(query: Prisma.EmailVerificationWhereUniqueInput) {
    return this.prismaService.emailVerification.deleteMany({ where: query })
  }

  updateOne(update: Prisma.EmailVerificationUpdateArgs) {
    return this.prismaService.emailVerification.update(update);
  }
}
