import {
  IsUUID,
  IsString,
  IsDateString,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class CreateCertificateDto {
  @IsUUID()
  userId: string;

  @IsString()
  fullName: string;
  
  @IsString()
  degree: string;

  @IsString()
  fieldOfStudy: string;

  @IsDateString()
  issueDate: string;

  @IsBoolean()
  status: boolean;

}
