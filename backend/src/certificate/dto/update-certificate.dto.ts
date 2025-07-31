import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
export class UpdateCertificateDto {
  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsEnum(['valid', 'revoked'])
  status?: 'valid' | 'revoked';
}