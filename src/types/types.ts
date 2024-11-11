import { Document, Schema } from 'mongoose';

export interface RentOffer extends Document {
    _id: string;
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
    coordinates:
    {
        latitude: number;
        longitude: number;
    };
}

export interface User extends Document {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    password: string;
    type: 'обычный' | 'pro';
}

export interface RentOfferWithUser extends RentOffer {
    user: User;
}

export interface Comment extends Document {
    _id: string;
    text: string;
    rating: number;
    author: Schema.Types.ObjectId;
    rentOffer: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface Favorite extends Document {
    _id: string;
    user: Schema.Types.ObjectId;
    rentOffer: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
