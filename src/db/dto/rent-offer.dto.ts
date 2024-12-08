import { IsString, IsBoolean, IsNumber, IsArray, IsEnum, ValidateNested, IsObject, IsOptional } from 'class-validator';
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

  @IsString()
    city!: string;

  @IsString()
    previewImage!: string;

  @IsArray()
  @IsString({ each: true })
    images!: string[];

  @IsBoolean()
    premium!: boolean;

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

  @IsNumber()
  @IsOptional()
    price?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDTO)
  @IsOptional()
    coordinates?: CoordinatesDTO;
}
