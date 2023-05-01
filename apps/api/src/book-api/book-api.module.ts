import { Module } from '@nestjs/common';

import { BookApiService } from './book-api.service';
import { OpenLibraryModule } from '../open-library/open-library.module';

@Module({
  imports: [OpenLibraryModule],
  providers: [BookApiService],
  exports: [BookApiService],
})
export class BookApiModule {}
