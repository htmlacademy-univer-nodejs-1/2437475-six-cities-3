import mongoose, { Schema, Document } from 'mongoose';

interface Favorite extends Document {
  user: mongoose.Schema.Types.ObjectId;
  rentOffer: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rentOffer: { type: Schema.Types.ObjectId, ref: 'RentOffer', required: true },
  },
  {
    timestamps: true,
  }
);

const FavoriteModel = mongoose.model<Favorite>('Favorite', FavoriteSchema);

export default FavoriteModel;
