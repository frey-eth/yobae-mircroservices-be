import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, GENDER } from 'shared/dto/create-user.dto';
@Injectable()
export class UsersServiceService {
  private users = [
    {
      id: 1,
      name: 'User One',
      email: 'user1@mail.com',
      password: 'password1',
      gender: GENDER.MALE,
    },
    {
      id: 2,
      name: 'User Two',
      email: 'user2@mail.com',
      password: 'password2',
      gender: GENDER.FEMALE,
    },
    {
      id: 3,
      name: 'User Three',
      email: 'user3@mail.com',
      password: 'password3',
      gender: GENDER.OTHER,
    },
    {
      id: 4,
      name: 'User Four',
      email: 'user4@mail.com',
      password: 'password4',
      gender: GENDER.MALE,
    },
    {
      id: 5,
      name: 'User Five',
      email: 'user5@mail.com',
      password: 'password5',
      gender: GENDER.FEMALE,
    },
  ];

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(createUserDto: CreateUserDto) {
    let password: string | undefined = undefined;
    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = bcrypt.hashSync(createUserDto.password, salt);
    }
    this.users.push({
      id: this.users.length + 1,
      ...createUserDto,
      password: password!,
    });

    return {
      status: 'Created user successfully',
      user: createUserDto,
    };
  }

  findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  findById(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
