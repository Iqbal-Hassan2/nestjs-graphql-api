import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument as UserDocument } from './schema/user.schema';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput, LoginResult } from './dto/users-inputs.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Creates a user
   */
  async create(createUserInput: CreateUserInput): Promise<LoginResult> {
    const createdUser = new this.userModel(createUserInput);
    const token = await this.authService.createJwt(createdUser);
    let user: UserDocument | undefined;
    try {
      user = await createdUser.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
    return { user, token: token.token };
  }
  // ---------------------------------------------------------
  /**
   * Returns a user by their unique email address or undefined
   */
  async findOneByEmail(email: string): Promise<UserDocument | undefined> {
    const user = await this.userModel
      .findOne({ lowercaseEmail: email.toLowerCase() })
      .exec();
    if (user) return user;
    throw new BadRequestException('Email does not exist.');
  }
  // ----------------------------------------------------------
  /**
   * Deletes all the users in the database, used for testing
   */
  async deleteUser(id: string): Promise<object> {
    const user = await this.userModel.deleteOne({ _id: id });
    if (user) return { message: 'user deleted successfully' };
    throw new BadRequestException('Email does not exist.');
  }
}
