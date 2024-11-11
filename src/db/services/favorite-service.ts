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

  async getFavorites(userId: string): Promise<Favorite[]> {
    return FavoriteModel.find({ user: userId }).populate('rentOffer').exec() as Promise<Favorite[]>;
  }
}

export default new FavoriteService();
