import { CreateUserDto } from './../../../shared/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from './database/prisma.service';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class UsersServiceService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(createUserDto: CreateUserDto) {
    let passwordHashed: string | undefined = undefined;
    const { email, password } = createUserDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new RpcException('User with this email already exists');
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHashed = await bcrypt.hash(password, salt);
    } else {
      throw new Error('Password is required');
    }
    console.log('Creating user with email:', email);
    const user = await this.prisma.user.create({
      data: {
        email,
        name: createUserDto.name,
        gender: createUserDto.gender,
        passwordHash: passwordHashed,
      },
    });
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      status: 'Created user successfully',
      user: userWithoutPassword,
    };
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      omit: {
        passwordHash: true,
      },
      where: { email },
    });
    if (!user) {
      throw new RpcException('User not found with email: ' + email);
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      omit: {
        passwordHash: true,
      },
      where: { id },
    });

    if (!user) {
      throw new RpcException('User not found');
    }
    return user;
  }
}
