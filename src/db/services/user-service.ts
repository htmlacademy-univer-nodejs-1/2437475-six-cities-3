import UserModel from '../models/user.js';
import { User } from '../../types/types.js';
import { CreateUserDTO, LoginDTO } from '../dto/user.dto.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

class UserService {
  async createUser(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const newUser = await UserModel.create({
      ...data,
      password: hashedPassword,
    });
    return newUser as User;
  }

  async findUserById(id: string): Promise<User | null> {
    return UserModel.findById(id).exec() as Promise<User | null>;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec() as Promise<User | null>;
  }

  async authenticateUser(data: LoginDTO): Promise<User | null> {
    const user = await UserModel.findOne({ email: data.email }).exec();
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
      if (isPasswordCorrect) {
        return user as User;
      }
    }
    return null;
  }

  async checkUserStatus(userId: string): Promise<boolean> {
    const user = await UserModel.findById(userId).exec();
    return !!user;
  }
}

export default new UserService();
