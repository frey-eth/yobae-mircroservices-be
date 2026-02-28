import { Controller } from '@nestjs/common';
import { UsersServiceService } from './users-service.service';
import { GrpcMethod } from '@nestjs/microservices';
import { GENDER } from 'shared/dto/create-user.dto';

@Controller()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  @GrpcMethod('UserService', 'CreateUser')
  createUser(data: {
    name: string;
    email: string;
    password: string;
    gender: string;
  }) {
    return this.usersServiceService.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender as GENDER,
    });
  }

  @GrpcMethod('UserService', 'UpdateUser')
  updateUser(data: {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    gender?: string;
  }) {
    return {
      message: `This action updates a #${data.id} user`,
    };
  }

  @GrpcMethod('UserService', 'FindByEmail')
  async findByEmail(data: { email: string }) {
    const user = await this.usersServiceService.findByEmail(data.email);
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @GrpcMethod('UserService', 'FindById')
  findById(data: { id: string }) {
    return this.usersServiceService.findById(data.id);
  }
}
