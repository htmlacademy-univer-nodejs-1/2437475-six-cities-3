import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type: 'обычный' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    password: { type: String, required: true },
    type: { type: String, enum: ['обычный', 'pro'], required: true },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
