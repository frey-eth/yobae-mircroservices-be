import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { UsersResolver } from './users.resolver';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_CLIENTS.USERS_SERVICE,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50052',
          package: 'user',
          protoPath: join(process.cwd(), 'shared/proto/user.proto'),
        },
      },
    ]),
  ],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
})
export class UsersModule {}
