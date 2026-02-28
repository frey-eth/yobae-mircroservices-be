import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from 'shared/dto/create-user.dto';
import { UsersGrpcService } from 'shared/proto/services-interface';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersGrpcService: UsersGrpcService;

  constructor(
    @Inject(MICROSERVICE_CLIENTS.USERS_SERVICE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.usersGrpcService =
      this.client.getService<UsersGrpcService>('UserService');
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      return await firstValueFrom(
        this.usersGrpcService.createUser({
          name: createUserDto.name,
          email: createUserDto.email,
          password: createUserDto.password,
          gender: createUserDto.gender,
        }),
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed';
      throw new HttpException(message, 400);
    }
  }

  async getUser(id: string): Promise<{
    id: string;
    email: string;
    name: string;
    gender: string;
  }> {
    if (!id) {
      throw new BadRequestException('id or email query parameter is required');
    }
    try {
      return await firstValueFrom(this.usersGrpcService.findById({ id }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed';
      throw new HttpException(message, 400);
    }
  }
}
