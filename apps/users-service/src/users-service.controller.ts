import { Controller, Get } from '@nestjs/common';
import { UsersServiceService } from './users-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'shared/dto/create-user.dto';

@Controller()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  @Get()
  getHello(): string {
    return this.usersServiceService.getHello();
  }

  @MessagePattern({ cmd: 'create_user' })
  createUser(@Payload() data: CreateUserDto) {
    return this.usersServiceService.createUser(data);
  }

  @MessagePattern({ cmd: 'update_user' })
  updateUser(
    @Payload() data: { id: string; updateData: Partial<CreateUserDto> },
  ) {
    return {
      message: 'This action updates a #${data.id} user',
      data,
    };
  }

  @MessagePattern({ cmd: 'user.find_by_email' })
  findByEmail(@Payload() email: string) {
    return this.usersServiceService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'user.find_by_id' })
  findById(@Payload() id: string) {
    return this.usersServiceService.findById(id);
  }
}
