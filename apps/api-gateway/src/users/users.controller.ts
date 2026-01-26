import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from 'shared/dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(MICROSERVICE_CLIENTS.USERS_SERVICE)
    private readonly usersServiceClient: ClientProxy,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      return await firstValueFrom(
        this.usersServiceClient.send({ cmd: 'create_user' }, createUserDto),
      );
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to create user', 400);
    }
  }

  @Get()
  async getUser(
    @Query('id', ParseIntPipe) id?: number,
    @Query('email') email?: string,
  ): Promise<any> {
    try {
      if (!id && !email) {
        throw new HttpException('id or email query parameter is required', 400);
      }
      if (id) {
        return await firstValueFrom(
          this.usersServiceClient.send({ cmd: 'find_user_by_id' }, id),
        );
      } else {
        return await firstValueFrom(
          this.usersServiceClient.send({ cmd: 'find_user_by_email' }, email),
        );
      }
    } catch (error) {
      throw new HttpException('Failed to get user' + error, 400);
    }
  }
}
