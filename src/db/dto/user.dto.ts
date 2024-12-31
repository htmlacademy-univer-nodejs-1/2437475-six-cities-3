import { IsString, IsEmail, IsOptional, MinLength, IsEnum, MaxLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
    name!: string;

  @IsEmail()
    email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
    password!: string;

  @IsOptional()
  @IsString()
    avatar?: string;

  @IsEnum(['обычный', 'pro'])
    type!: 'обычный' | 'pro';
}

export class LoginDTO {
  @IsEmail()
    email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
    password!: string;
}
