export interface RentOffer {
    name: string;
    description: string;
    publishedAt: Date;
    city: 'Moscow' | 'Saint Petersburg' | 'Kazan' | 'Nizhny Novgorod' | 'Yekaterinburg' | 'Rostov-on-Don';
    previewImage: string;
    images: string[];
    premium: boolean;
    favorite: boolean;
    rating: number;
    type: 'apartment' | 'house' | 'room' | 'hotel';
    rooms: number;
    guests: number;
    price: number;
    features: string[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    password: string;
    type: 'обычный' | 'pro';
}

export interface RentOfferWithUser extends RentOffer {
    user: User;
}
