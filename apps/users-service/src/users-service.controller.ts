import { Controller, Get } from '@nestjs/common';
import { UsersServiceService } from './users-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  @Get()
  getHello(): string {
    return this.usersServiceService.getHello();
  }

  @MessagePattern({ cmd: 'create_user' })
  createUser(data: { name: string; email: string }) {
    return {
      message: 'User created successfully',
      user: data,
    };
  }
}
