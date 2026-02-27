import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_CLIENTS.USERS_SERVICE,
        transport: Transport.TCP,
        options: { port: 4001 },
      },
    ]),
  ],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
})
export class UsersModule {}
