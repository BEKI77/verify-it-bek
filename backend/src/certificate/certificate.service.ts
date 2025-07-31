import { Inject, Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import * as crypto from 'crypto';
import { certificates } from 'src/db/schema/certificate.schema';
import { DB } from 'src/db/db.module';
import { DrizzleDB } from 'src/db/types/db';

@Injectable()
export class CertificateService {
  constructor(
      @Inject(DB) 
      private readonly db: DrizzleDB,
  ) {}
  
  async issueCertificate(dto: CreateCertificateDto, instituteId: number) {
    const hash = this.generateCertificateHash({
      ...dto,
      instituteId,
    });

    const certificate = await this.db.insert(certificates).values({
      fullName: dto.fullName,
      program: dto.degree,
      institutionId: instituteId,
      fieldOfStudy: dto.fieldOfStudy,
      verified: dto.status,
      issuedAt: new Date(dto.issueDate),
      hash,
    });

    return certificate;
  }
  
  generateCertificateHash({ userId, instituteId, degree, fieldOfStudy, issueDate, }:{
      userId: string;
      instituteId: number;
      degree: string;
      fieldOfStudy: string;
      issueDate: string;
    }): string {

    const raw = `${userId}|${instituteId}|${degree}|${fieldOfStudy}|${issueDate}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

}
