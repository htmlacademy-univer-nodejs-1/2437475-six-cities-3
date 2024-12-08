#!/usr/bin/env node

import chalk from 'chalk';
import { RentOfferWithUser } from '../types/types.js';
import { createWriteStream } from 'node:fs';

interface City {
  latitude: number;
  longitude: number;
}

interface RandomUser {
  id: string[];
  name: string[];
  email: string[];
  avatar?: string[];
  password: string[];
  type: string[];
}

interface RandomData {
  name: string[];
  description: string[];
  publishedAt: string[];
  city: Record<string, City>;
  previewImage: string[];
  images: string[][];
  premium: boolean[];
  favorite: boolean[];
  rating: number[];
  type: string[];
  rooms: number[];
  guests: number[];
  price: number[];
  features: string[][];
  user: RandomUser;
}

interface ServerData {
  randomData: RandomData;
}

let ServerData: RandomData;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomRentOfferWithUser(): RentOfferWithUser {
  const data = ServerData;
  const city = getRandomElement(Object.keys(data.city));

  return {
    _id: ' ',
    name: getRandomElement(data.name),
    description: getRandomElement(data.description),
    publishedAt: new Date(getRandomElement(data.publishedAt)),
    city: city,
    previewImage: getRandomElement(data.previewImage),
    images: getRandomElement(data.images),
    premium: getRandomElement(data.premium),
    favorite: getRandomElement(data.favorite),
    rating: getRandomElement(data.rating),
    type: getRandomElement(data.type),
    rooms: getRandomElement(data.rooms),
    guests: getRandomElement(data.guests),
    price: Math.floor(Math.random() * 90000 + 100),
    features: getRandomElement(data.features),
    rentOfferUser: {
      _id: ' ',
      name: getRandomElement(data.user.name),
      email: getRandomElement(data.user.email),
      avatar: getRandomElement(data.user.avatar || []),
      password: getRandomElement(data.user.password),
      type: getRandomElement(data.user.type) as 'обычный' | 'pro'
    },
    coordinates: {
      latitude: Number(data.city[city].latitude),
      longitude: Number(data.city[city].longitude)
    }
  } as RentOfferWithUser;
}


export async function generateTestData(n: number, filepath: string, url: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    ServerData = data as RandomData;
    // console.log(chalk.green('Полученные данные:', JSON.stringify(data, null, 2)));

  } catch (error) {
    console.error(chalk.red(`Ошибка при загрузке данных: ${(error as Error).message}`));
  }

  const rentOffers: RentOfferWithUser[] = Array.from({ length: n }, generateRandomRentOfferWithUser);

  const tsvData = rentOffers.map((offer) => [
    offer.name,
    offer.description,
    offer.publishedAt.toISOString(),
    offer.city,
    offer.previewImage,
    offer.images.join(';'),
    offer.premium.toString(),
    offer.favorite.toString(),
    offer.rating.toFixed(1),
    offer.type,
    offer.rooms.toString(),
    offer.guests.toString(),
    offer.price.toString(),
    offer.features.join(';'),
    offer.rentOfferUser.id,
    offer.rentOfferUser.name,
    offer.rentOfferUser.email,
    offer.rentOfferUser.avatar || '',
    offer.rentOfferUser.password,
    offer.rentOfferUser.type,
    offer.coordinates.latitude.toString(),
    offer.coordinates.longitude.toString()
  ].join('\t')).join('\n');

  const writeStream = createWriteStream(filepath, { flags: 'w' });

  const writeDataAsync = async () => {
    await new Promise((resolve) => {
      writeStream.on('finish', resolve);
      writeStream.write(tsvData);
    });
  };
  await writeDataAsync();

  console.log(chalk.green(`Сгенерированы ${n} тестовых предложений в файле: ${filepath}`));
}
