import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class CertificateDataDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    degree: string;

    @IsString()
    @IsNotEmpty()
    fieldOfStudy: string;

    @IsString()
    @IsNotEmpty()
    issuedAt: string;

    @IsNumber()
    @IsNotEmpty()
    cgpa: number;
}