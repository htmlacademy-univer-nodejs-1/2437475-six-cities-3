import { IsString, IsBoolean, IsNumber, IsArray, IsEnum, IsDate, ValidateNested, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CoordinatesDTO {
  @IsNumber()
    latitude!: number;

  @IsNumber()
    longitude!: number;
}

export class CreateRentOfferDTO {
  @IsString()
    name!: string;

  @IsString()
    description!: string;

  @IsDate()
  @Type(() => Date)
    publishedAt!: Date;

  @IsString()
    city!: string;

  @IsString()
    previewImage!: string;

  @IsArray()
  @IsString({ each: true })
    images!: string[];

  @IsBoolean()
    premium!: boolean;

  @IsBoolean()
    favorite!: boolean;

  @IsNumber()
    rating!: number;

  @IsEnum(['apartment', 'house', 'room', 'hotel'])
    type!: 'apartment' | 'house' | 'room' | 'hotel';

  @IsNumber()
    rooms!: number;

  @IsNumber()
    guests!: number;

  @IsNumber()
    price!: number;

  @IsArray()
  @IsString({ each: true })
    features!: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDTO)
    coordinates!: CoordinatesDTO;
}

export class UpdateRentOfferDTO {
  @IsString()
  @IsOptional()
    name?: string;

  @IsString()
  @IsOptional()
    description?: string;

  @IsBoolean()
  @IsOptional()
    premium?: boolean;

  @IsBoolean()
  @IsOptional()
    favorite?: boolean;

  @IsNumber()
  @IsOptional()
    price?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDTO)
  @IsOptional()
    coordinates?: CoordinatesDTO;
}
