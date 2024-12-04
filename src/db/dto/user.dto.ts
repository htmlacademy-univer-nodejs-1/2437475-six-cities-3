import { IsString, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';

export class CreateUserDTO {
  @IsString()
    name!: string;

  @IsEmail()
    email!: string;

  @IsString()
  @MinLength(6)
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
    password!: string;
}
