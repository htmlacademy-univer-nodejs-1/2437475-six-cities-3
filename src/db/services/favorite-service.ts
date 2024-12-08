import FavoriteModel from '../models/favorite.js';
import { Favorite } from '../../types/types.js';
import { FavoriteDTO } from '../dto/favorite.dto.js';

class FavoriteService {
  async addFavorite(data: FavoriteDTO): Promise<Favorite> {
    const favorite = await FavoriteModel.create(data);
    return favorite as Favorite;
  }

  async removeFavorite(data: FavoriteDTO): Promise<void> {
    await FavoriteModel.findOneAndDelete(data).exec();
  }

  async findById(id: string): Promise<Favorite[] | null> {
    return this.getFavorites(id);
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    return FavoriteModel.find({ user: userId }).populate('rentOffer').exec() as Promise<Favorite[]>;
  }

  async findFavorite(userId: string, rentOfferId: string): Promise<Favorite | null> {
    return FavoriteModel.findOne({ user: userId, rentOffer: rentOfferId }).exec() as Promise<Favorite | null>;
  }
}

export default new FavoriteService();
