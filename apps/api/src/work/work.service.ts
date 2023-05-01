import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { AuthorService } from '../author/author.service';
import { BookApiService } from '../book-api/book-api.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkService {
  constructor(
    private prismaService: PrismaService,
    private bookApiService: BookApiService,
    private authorService: AuthorService,
  ) {}

  findByOlid(olid: string) {
    return this.prismaService.work.findUnique({ where: { olid } });
  }

  create(workCreateInput: Prisma.WorkCreateInput) {
    return this.prismaService.work.create({ data: workCreateInput });
  }

  async createFromApiData(workApiData) {
    const authors = await Promise.all(workApiData.authorOlids.map(async (authorOlid) => {
      return (
        await this.authorService.findByOlid(authorOlid)
        || await this.authorService.findInApiByOlidAndCreate(authorOlid)
      );
    }));
    const workCreateInput = {
      olid: workApiData.olid,
      title: workApiData.title,
      description: workApiData.description || undefined,
      authors: {
        connect: authors.map((author) => ({ id: author.id }))
      },
    };
    return this.create(workCreateInput);
  }

  async findInApiByOlidAndCreate(olid: string) {
    const workApiData = await this.bookApiService.findWorkByOlid(olid);
    return this.createFromApiData(workApiData);
  }
}
