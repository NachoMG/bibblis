import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserBookDto } from './dto/get-user-book.dto';
import { IRequestWithDefaultTokenPayloadWithToken } from '../auth/interfaces/i-request-with-access-token-payload-with-token';
import { AddUserBookDto } from './dto/add-user-book.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: 'Finds a book in the logged user collection' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @Get('/me/book/:bookId')
  getUserBook(
    @Param() getUserBookDto: GetUserBookDto,
    @Req() req: IRequestWithDefaultTokenPayloadWithToken
  ) {
    return this.userService.getUserBook({
      userId: req.user.sub,
      bookId: getUserBookDto.bookId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: 'Adds a book to the logged user collection' })
  @ApiResponse({ status: 201, description: 'Book added' })
  @ApiResponse({ status: 409, description: 'Book already in collection' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/me/book')
  addUserBook(
    @Body() getUserBookDto: AddUserBookDto,
    @Req() req: IRequestWithDefaultTokenPayloadWithToken
  ) {
    return this.userService.addUserBook({
      userId: req.user.sub,
      bookId: getUserBookDto.bookId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: 'Removes a book from the logged user collection' })
  @ApiResponse({ status: 200, description: 'Book succesfully removed from logged user collection' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @Delete('/me/book/:bookId')
  removeUserBook(
    @Param() getUserBookDto: GetUserBookDto,
    @Req() req: IRequestWithDefaultTokenPayloadWithToken
  ) {
    return this.userService.removeUserBook({
      userId: req.user.sub,
      bookId: getUserBookDto.bookId,
    });
  }
}
