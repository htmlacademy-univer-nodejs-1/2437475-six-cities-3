import { Document } from 'mongoose';

export interface UserEntity extends Document {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type: 'обычный' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}
