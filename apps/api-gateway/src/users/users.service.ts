import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from 'shared/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(MICROSERVICE_CLIENTS.USERS_SERVICE)
    private readonly usersServiceClient: ClientProxy,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      return await firstValueFrom(
        this.usersServiceClient.send({ cmd: 'create_user' }, createUserDto),
      );
    } catch (error) {
      //eslint-disable-next-line
      throw new HttpException(error?.message || 'Failed', 400);
    }
  }

  async getUser(id: string): Promise<any> {
    if (!id) {
      throw new BadRequestException('id or email query parameter is required');
    }
    try {
      return await firstValueFrom(
        this.usersServiceClient.send({ cmd: 'user.find_by_id' }, id),
      );
    } catch (error) {
      //eslint-disable-next-line
      throw new HttpException(error?.message || 'Failed', 400);
    }
  }
}
