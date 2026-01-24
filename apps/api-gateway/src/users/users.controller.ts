import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(MICROSERVICE_CLIENTS.USERS_SERVICE)
    private readonly usersServiceClient: ClientProxy,
  ) {}

  @Post()
  createUser(@Body() createUserDto: { name: string; email: string }) {
    return this.usersServiceClient.send({ cmd: 'create_user' }, createUserDto);
  }
}
