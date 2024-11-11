import { Document, Schema } from 'mongoose';

export interface CommentEntity extends Document {
  text: string;
  rating: number;
  author: Schema.Types.ObjectId;
  rentOffer: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
