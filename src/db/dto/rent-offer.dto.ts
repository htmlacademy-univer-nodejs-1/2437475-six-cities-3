import { IsString, IsBoolean, IsNumber, IsArray, IsEnum, ValidateNested, IsObject, IsOptional, MaxLength, MinLength, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CoordinatesDTO {
  @IsNumber()
    latitude!: number;

  @IsNumber()
    longitude!: number;
}

export class CreateRentOfferDTO {
  @IsString()
  @MaxLength(100)
  @MinLength(10)
    name!: string;

  @IsString()
  @MaxLength(1024)
  @MinLength(20)
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
  @Max(8)
  @Min(1)
    rooms!: number;

  @IsNumber()
  @Max(10)
  @Min(1)
    guests!: number;

  @IsNumber()
  @Max(100000)
  @Min(100)
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
  @MaxLength(100)
  @MinLength(10)
    name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  @MinLength(20)
    description?: string;

  @IsBoolean()
  @IsOptional()
    premium?: boolean;

  @IsNumber()
  @IsOptional()
  @Max(100000)
  @Min(100)
    price?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDTO)
  @IsOptional()
    coordinates?: CoordinatesDTO;
}
