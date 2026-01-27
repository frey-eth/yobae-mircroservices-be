import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { firstValueFrom } from 'rxjs';
import { AuthGrpcService } from 'shared/proto/services-interface';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthGrpcService;
  constructor(
    @Inject(MICROSERVICE_CLIENTS.AUTH_SERVICE)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthGrpcService>('AuthService');
  }

  async login(email: string, password: string) {
    return await firstValueFrom(this.authService.login({ email, password }));
  }

  async refreshToken(refreshToken: string) {
    return await firstValueFrom(
      this.authService.refreshToken({ refreshToken }),
    );
  }
}
