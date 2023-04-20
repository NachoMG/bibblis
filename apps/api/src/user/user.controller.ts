import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';

import { User } from '@prisma/client';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param() params): Promise<User> {
    const user = await this.userService.findOne({ id: params.id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
