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
}

const RentOfferSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    publishedAt: { type: Date, required: true },
    city: { type: String, required: true },
    previewImage: { type: String, required: true },
    images: { type: [String], required: true },
    premium: { type: Boolean, required: true },
    favorite: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    type: { type: String, required: true },
    rooms: { type: Number, required: true },
    guests: { type: Number, required: true },
    price: { type: Number, required: true },
    features: { type: [String], required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const RentOfferModel = mongoose.model<RentOffer>('RentOffer', RentOfferSchema);

export default RentOfferModel;
