import { Document, Schema } from 'mongoose';

export interface FavoriteEntity extends Document {
  user: Schema.Types.ObjectId;
  rentOffer: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
