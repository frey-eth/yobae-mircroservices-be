import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateUserDto } from 'shared/dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getUser(@Query('id') id: string): Promise<any> {
    return this.userService.getUser(id);
  }
}
