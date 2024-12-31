import mongoose, { Schema, Document } from 'mongoose';

interface RentOffer extends Document {
  name: string;
  description: string;
  publishedAt: Date;
  city: string;
  previewImage: string;
  images: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  type: string;
  rooms: number;
  guests: number;
  price: number;
  features: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
  user: Schema.Types.ObjectId;
}

const RentOfferSchema: Schema = new Schema(
  {
    name: { type: String, required: true, minlength: 10, maxlength: 100 },
    description: { type: String, required: true, minlength: 20, maxlength: 1024 },
    publishedAt: { type: Date, default: Date.now },
    city: { type: String, required: true },
    previewImage: { type: String, required: true },
    images: { type: [String], required: true },
    premium: { type: Boolean, required: true },
    favorite: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    type: { type: String, required: true },
    rooms: { type: Number, required: true, min: 1, max: 8 },
    guests: { type: Number, required: true, min: 1, max: 10 },
    price: { type: Number, required: true, min: 100, max: 100000 },
    features: { type: [String], required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    commentCount: { type: Number, required: true, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

const RentOfferModel = mongoose.model<RentOffer>('RentOffer', RentOfferSchema);

export default RentOfferModel;
