import { Injectable } from '@nestjs/common';

import { OpenLibraryService } from '../open-library/open-library.service';

@Injectable()
export class BookApiService {
  constructor(private openLibraryService: OpenLibraryService) {}

  formatOpenLibraryBook(openLibraryBook) {
    const identifiers = [];
    if (openLibraryBook.identifiers) {
      for (
        const [
          identifierName,
          identifierValue,
        ] of Object.entries(openLibraryBook.identifiers)
      ) {
        identifiers.push({
          name: identifierName,
          value: identifierValue[0],
        });
      }
    }
    if (openLibraryBook.isbn_10 && openLibraryBook.isbn_10[0]) {
      identifiers.push({
        name: 'isbn10',
        value: openLibraryBook.isbn_10[0],
      });
    }
    if (openLibraryBook.isbn_13 && openLibraryBook.isbn_13[0]) {
      identifiers.push({
        name: 'isbn13',
        value: openLibraryBook.isbn_13[0],
      });
    }
    const bookOlid = openLibraryBook.key.split('/').pop();
    identifiers.push({
      name: 'olid',
      value: bookOlid,
    });

    // TODO Upload to AWS S3 and save instead the S3 resource URI
    const coverIdentifier = openLibraryBook.covers?.[0];
    const coverResource = (
      coverIdentifier
      && `https://covers.openlibrary.org/b/id/${coverIdentifier}-L.jpg`
      || undefined
    );

    return {
      title: openLibraryBook.title,
      publishedAt: openLibraryBook.publish_date,
      publisher: openLibraryBook.publishers?.join(', ') || undefined,
      description: (
        openLibraryBook.description?.value
        || openLibraryBook.description
        || undefined
      ),
      cover: coverResource,
      pages: openLibraryBook.number_of_pages,
      identifiers,
      workOlid: openLibraryBook.works?.[0].key?.split('/').pop() || undefined,
    };
  }

  async findBookByIsbn(isbn: string) {
    const openLibraryBook = await this.openLibraryService.findBookByIsbn(isbn);
    if (openLibraryBook) {
      const book = this.formatOpenLibraryBook(openLibraryBook);
      return book;
    }
    return null;
  }

  formatOpenLibraryWork(openLibraryWork) {
    return {
      olid: openLibraryWork.key.split('/').pop(),
      title: openLibraryWork.title,
      description: (
        openLibraryWork.description?.value
        || openLibraryWork.description
        || undefined
      ),
      authorOlids: openLibraryWork.authors.reduce((acc, author) => {
        if (author.author?.key) {
          acc.push(author.author.key.split('/').pop());
        }
        return acc;
      }, []),
    };
  }

  async findWorkByOlid(olid: string) {
    const openLibraryWork = await this.openLibraryService.findWork(olid);
    if (openLibraryWork) {
      return this.formatOpenLibraryWork(openLibraryWork);
    }
    return null;
  }

  formatOpenLibraryAuthor(openLibraryAuthor) {
    return {
      olid: openLibraryAuthor.key.split('/').pop(),
      name: openLibraryAuthor.name,
      aliases: openLibraryAuthor.alternate_names || [],
      bio: openLibraryAuthor.bio?.value || openLibraryAuthor.bio || undefined,
      birthDate: openLibraryAuthor.birth_date,
    };
  }

  async findAuthorByOlid(olid: string) {
    const openLibraryAuthor = await this.openLibraryService.findAuthor(olid);
    if (openLibraryAuthor) {
      return this.formatOpenLibraryAuthor(openLibraryAuthor);
    }
    return null;
  }
}
