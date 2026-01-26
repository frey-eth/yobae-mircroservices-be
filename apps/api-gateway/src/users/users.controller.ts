import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
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
      //eslint-disable-next-line
      throw new HttpException(error?.message || 'Failed', 400);
    }
  }

  @Get()
  async getUser(
    @Query('id') id?: string,
    @Query('email') email?: string,
  ): Promise<any> {
    if (!id && !email) {
      throw new BadRequestException('id or email query parameter is required');
    }
    try {
      if (id) {
        const userId = Number(id);
        if (Number.isNaN(userId)) {
          throw new BadRequestException('id must be a number');
        }

        return await firstValueFrom(
          this.usersServiceClient.send({ cmd: 'user.find_by_id' }, userId),
        );
      }
      return await firstValueFrom(
        this.usersServiceClient.send(
          { cmd: 'user.find_by_email' },
          email?.toLowerCase(),
        ),
      );
    } catch (error) {
      //eslint-disable-next-line
      throw new HttpException(error?.message || 'Failed', 400);
    }
  }

  @Get('/all')
  async getAllUsers(): Promise<any> {
    try {
      return await firstValueFrom(
        this.usersServiceClient.send({ cmd: 'user.find_all' }, {}),
      );
    } catch (error) {
      //eslint-disable-next-line
      throw new HttpException(error?.message || 'Failed', 400);
    }
  }
}
