import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';
import { UsersService } from './users.service';
import { CreateUserInput, LoginResult } from './dto/users-inputs.dto';
import { User, UserDocument } from './schema/user.schema';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => LoginResult)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<LoginResult> {
    let createdUser: LoginResult | undefined;
    try {
      createdUser = await this.usersService.create(createUserInput);
    } catch (error) {
      throw new UserInputError(error);
    }
    return createdUser;
  }

  //
  @Query(() => User)
  async findByEmail(
    @Args('email') email: string,
  ): Promise<UserDocument | undefined> {
    let result: UserDocument | undefined;
    try {
      result = await this.usersService.findOneByEmail(email);
    } catch (error) {
      throw new UserInputError(error);
    }
    return result;
  }
  @Query(() => String)
  async deleteUser(@Args('id') id: string) {
    let result: object;
    try {
      result = await this.usersService.deleteUser(id);
    } catch (error) {
      throw new UserInputError(error);
    }
    return result;
  }
}
