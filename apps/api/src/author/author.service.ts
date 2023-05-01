import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { BookApiService } from '../book-api/book-api.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(
    private prismaService: PrismaService,
    private bookApiService: BookApiService,
  ) {}

  findByOlid(olid: string) {
    return this.prismaService.author.findUnique({ where: { olid } });
  }

  create(authorCreateInput: Prisma.AuthorCreateInput) {
    return this.prismaService.author.create({ data: authorCreateInput });
  }

  createFromApiData(authorApiData) {
    const authorCreateInput = {
      olid: authorApiData.olid,
      name: authorApiData.name,
      bio: authorApiData.bio || undefined,
      birthDate: authorApiData.birthDate,
      aliases: { create: authorApiData.aliases.map((alias) => ({ alias })) },
    };
    return this.create(authorCreateInput);
  }

  async findInApiByOlidAndCreate(olid: string) {
    const workApiData = await this.bookApiService.findAuthorByOlid(olid);
    return this.createFromApiData(workApiData);
  }
}
