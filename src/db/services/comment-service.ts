import { Comment } from '../../types/types.js';
import { CreateCommentDTO } from '../dto/comment.dto.js';
import CommentModel from '../models/comment.js';
import RentOfferService from './rent-offer-service.js';

class CommentService {
  async addComment(data: CreateCommentDTO): Promise<Comment> {
    const newComment = await CommentModel.create(data);
    if (data.rentOffer) {
      await RentOfferService.calculateRating(data.rentOffer.toString());
      await RentOfferService.updateCommentCount(data.rentOffer.toString());
    }
    return newComment as Comment;
  }

  async getCommentsForRentOffer(rentOfferId: string, limit: number = 50): Promise<Comment[]> {
    return CommentModel.find({ rentOffer: rentOfferId }).limit(limit).sort({ createdAt: -1 }).exec() as Promise<Comment[]>;
  }
}

export default new CommentService();
