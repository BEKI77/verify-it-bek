import { IsEmail, IsString, IsOptional, IsUrl } from 'class-validator';
export class CreateInstitutionDto {
  
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

}
