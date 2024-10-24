import UserModel from '../models/user.js';
import { User } from '../../types/types.js';

class UserService {
  async createUser(data: Partial<User>): Promise<User> {
    const newUser = await UserModel.create(data);
    return newUser as User;
  }

  async findUserById(id: string): Promise<User | null> {
    return UserModel.findById(id).exec() as Promise<User | null>;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec() as Promise<User | null>;
  }
}

export default new UserService();
