import { IsString, IsMongoId } from 'class-validator';

export class FavoriteDTO {
  @IsString()
  @IsMongoId()
    user!: string;

  @IsString()
  @IsMongoId()
    rentOffer!: string;
}
