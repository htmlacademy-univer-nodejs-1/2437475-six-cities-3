import { RentOffer } from "../../types/types.js";
import RentOfferModel from "../models/rent-offer.js";

class RentOfferService {
  async createRentOffer(data: Partial<RentOffer>): Promise<RentOffer> {
    const newRentOffer = await RentOfferModel.create(data);
    return newRentOffer as RentOffer;
  }

  async findRentOfferById(id: string): Promise<RentOffer | null> {
    return RentOfferModel.findById(id).exec() as Promise<RentOffer | null>;
  }

  async findAllRentOffers(): Promise<RentOffer[]> {
    return RentOfferModel.find().exec() as Promise<RentOffer[]>;
  }
}

export default new RentOfferService();