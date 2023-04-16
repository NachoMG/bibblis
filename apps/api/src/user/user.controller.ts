import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { User } from '@prisma/client';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async findOne(@Param() params): Promise<User> {
    const user = await this.userService.findOne({ id: params.id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
