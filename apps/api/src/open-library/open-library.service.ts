import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OpenLibraryService {
  constructor(private httpService: HttpService) {}

  private baseUrl = 'https://openlibrary.org/';

  async findBookByIsbn(isbn: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}isbn/${isbn}.json`)
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async findWork(olid: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}works/${olid}.json`)
      );
      return response.data;
  } catch (error) {
    return null;
  }
  }

  async findAuthor(olid: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}authors/${olid}.json`)
      );
      return response.data; 
    } catch (error) {
      return null;
    }
  }
}
