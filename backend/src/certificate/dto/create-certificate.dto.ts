import {
  IsString,
  IsDateString,
  IsNumber,
  IsNotEmpty
} from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;
  
  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  fieldOfStudy: string;

  @IsDateString()
  @IsNotEmpty()
  issuedAt: string;

  @IsNumber()
  @IsNotEmpty()
  institutionId: number;

}
