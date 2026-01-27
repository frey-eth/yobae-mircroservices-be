import { Controller } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @GrpcMethod('AuthService', 'Login')
  async login({ email, password }: { email: string; password: string }) {
    const result = await this.authServiceService.login(email, password);
    return result;
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  refreshToken({ refreshToken }: { refreshToken: string }) {
    return this.authServiceService.refreshToken(refreshToken);
  }
}
