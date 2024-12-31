import { IsString, IsNumber, IsMongoId, MinLength, MaxLength, Min, Max } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
    text!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
    rating!: number;

  @IsMongoId()
    author!: string;

  @IsMongoId()
    rentOffer!: string;
}

