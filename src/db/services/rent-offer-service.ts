import { RentOffer } from '../../types/types.js';
import RentOfferModel from '../models/rent-offer.js';
import CommentModel from '../models/comment.js';
import { CreateRentOfferDTO, UpdateRentOfferDTO } from '../dto/rent-offer.dto.js';
import { EntityService } from './entity-service.js';

class RentOfferService implements EntityService {
  async createRentOffer(data: CreateRentOfferDTO): Promise<RentOffer> {
    const newRentOffer = await RentOfferModel.create(data);
    return newRentOffer as RentOffer;
  }

  async findRentOfferById(id: string): Promise<RentOffer | null> {
    return RentOfferModel.findById(id).exec() as Promise<RentOffer | null>;
  }

  async findById(id: string): Promise<RentOffer | null> {
    return this.findRentOfferById(id);
  }

  async findAllRentOffers(limit: number = 60): Promise<RentOffer[]> {
    return RentOfferModel.find().limit(limit).exec() as Promise<RentOffer[]>;
  }

  async editRentOffer(id: string, data: UpdateRentOfferDTO): Promise<RentOffer | null> {
    return RentOfferModel.findByIdAndUpdate(id, data, { new: true }).exec() as Promise<RentOffer | null>;
  }

  async deleteRentOffer(id: string): Promise<void> {
    await RentOfferModel.findByIdAndDelete(id).exec();
  }

  async calculateRating(rentOfferId: string): Promise<number> {
    const comments = await CommentModel.find({ rentOffer: rentOfferId }).exec();

    if (comments.length === 0) {
      await RentOfferModel.findByIdAndUpdate(rentOfferId, { rating: 0 }).exec();
      return 0;
    }

    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = totalRating / comments.length || 0;
    await RentOfferModel.findByIdAndUpdate(rentOfferId, { rating: averageRating }).exec();
    return averageRating;
  }

  async updateCommentCount(rentOfferId: string): Promise<void> {
    const commentCount = await CommentModel.countDocuments({ rentOffer: rentOfferId });
    await RentOfferModel.findByIdAndUpdate(rentOfferId, { commentCount }).exec();
  }
}

export default new RentOfferService();
