export interface CreateRentOfferDTO {
  name: string;
  description: string;
  publishedAt: Date;
  city: string;
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
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface UpdateRentOfferDTO {
  name?: string;
  description?: string;
  publishedAt?: Date;
  city?: string;
  previewImage?: string;
  images?: string[];
  premium?: boolean;
  favorite?: boolean;
  rating?: number;
  type?: 'apartment' | 'house' | 'room' | 'hotel';
  rooms?: number;
  guests?: number;
  price?: number;
  features?: string[];
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
}
