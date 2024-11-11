import { Document } from 'mongoose';

export interface RentOfferEntity extends Document {
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
