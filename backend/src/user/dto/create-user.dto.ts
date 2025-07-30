import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // @IsNotEmpty()
  role: 'admin' | 'institution' | 'user';

  @IsString()
  @IsOptional()
  fan?: string;

  @IsString()
  @IsOptional()
  fin?: string;
}