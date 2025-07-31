import { IsEmail, IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsOptional()
  fan?: string;

  @IsString()
  @IsOptional()
  fin?: string;

  @IsString()
  @IsNotEmpty()
  registrationType: 'fayda' | 'email';
}