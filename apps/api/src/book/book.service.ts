import { Injectable, NotFoundException } from '@nestjs/common';

import { Book, Prisma } from '@prisma/client';

import { SearchByIsbnDto } from './dto/search-by-isbn.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BookApiService } from '../book-api/book-api.service';
import { WorkService } from '../work/work.service';
import { GetBookPagaDataDto } from './dto/get-book-page-data-dto';

@Injectable()
export class BookService {
  constructor(
    private prismaService: PrismaService,
    private bookApiService: BookApiService,
    private workService: WorkService,
  ) {}

  findByIdentifier(value: string, identifierName: string) {
    return this.prismaService.book.findFirst({
      where: {
        identifiers: {
          some: {
            type: { name: identifierName },
            value,
          },
        },
      },
    });
  }

  findByIsbn(isbn: string) {
    let identifierName = '';
    if (isbn.length === 10) {
      identifierName = 'isbn10';
    }
    if (isbn.length === 13) {
      identifierName = 'isbn13';
    }
    return this.findByIdentifier(isbn, identifierName);
  }
  
  create(bookCreateInput: Prisma.BookCreateInput): Promise<Book> {
    return this.prismaService.book.create({ data: bookCreateInput });
  }

  async createFromApiData(bookApiData) {
    const work = (
      await this.workService.findByOlid(bookApiData.workOlid)
      || await this.workService.findInApiByOlidAndCreate(bookApiData.workOlid)
    );
  
    const bookCreateInput = {
      ...bookApiData,
      work: { connect: { id: work.id } },
      identifiers: {
        create: bookApiData.identifiers.map((identifier) => {
          return {
            value: identifier.value,
            type: {
              connectOrCreate: {
                where: {
                  name: identifier.name,
                },
                create: {
                  name: identifier.name,
                },
              },
            },
          };
        }),
      },
      workOlid: undefined,
    };
    
    return this.create(bookCreateInput);
  }

  async searchByIsbn({ isbn }: SearchByIsbnDto) {
    const book = await this.findByIsbn(isbn);
    if (book) {
      return book;
    }

    const bookApiData = await this.bookApiService.findBookByIsbn(isbn);
    if (bookApiData) {
      return this.createFromApiData(bookApiData);
    }
    
    throw new NotFoundException();
  }

  async getBookPageData({ id }: GetBookPagaDataDto) {
    const book = await this.prismaService.book.findUnique({
      where: { id },
      include: {
        work: {
          select: {
            authors: {
              select: { id: true , name: true },
            },
            books: {
              take: 10,
              where: { id: { not: id } },
            },
            description: true,
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException();
    }

    return book;
  }
}
