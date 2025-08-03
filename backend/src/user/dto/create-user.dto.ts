import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsNotEmpty()
  role: 'admin' | 'institution' | 'user';

  @IsString()
  @IsNotEmpty()
  registrationType: 'fayda' | 'email';
}