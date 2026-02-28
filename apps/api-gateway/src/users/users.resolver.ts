import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserDto } from 'shared/dto/create-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<any> {
    return this.userService.getUser(id);
  }

  @ResolveField(() => String)
  getProfile(@Parent() user: User): string {
    return 'user profile infomation:' + user.id;
  }
  @ResolveField()
  getPosts(@Parent() user: User): string {
    return 'user posts infomation:' + user.id;
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<any> {
    const { user } = (await this.userService.createUser(createUserDto)) as {
      user: User;
    };
    return user;
  }
}
