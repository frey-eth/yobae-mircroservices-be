import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_CLIENTS.AUTH_SERVICE,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: 'auth',
          protoPath: join(process.cwd(), 'shared/proto/auth.proto'),
        },
      },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
