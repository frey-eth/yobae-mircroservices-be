import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from 'shared/dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'shared/guard/auth.guard';
import { JwtPayload } from 'shared/types';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request): Promise<any> {
    return this.userService.getUser(req.user?.id as string);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<any> {
    return this.userService.getUser(id);
  }
}

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}
