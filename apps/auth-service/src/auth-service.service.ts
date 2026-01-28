import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { User } from 'apps/users-service/generated/prisma/client';
import { JwtPayload } from 'shared/types';

@Injectable()
export class AuthServiceService {
  constructor(
    @Inject(MICROSERVICE_CLIENTS.USERS_SERVICE)
    private readonly usersServiceClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user: User = await firstValueFrom(
      this.usersServiceClient.send({ cmd: 'user.find_by_email' }, email),
    );
    if (!user) {
      throw new RpcException('Invalid credentials');
    }
    const comparePassword = bcrypt.compareSync(password, user.passwordHash);
    if (!comparePassword) {
      throw new RpcException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  refreshToken(refreshToken: string) {
    try {
      const decoded: JwtPayload = this.jwtService.verify(refreshToken);
      const payload = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      return {
        accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      };
    } catch (error) {
      throw new RpcException('Invalid refresh token');
    }
  }
}
