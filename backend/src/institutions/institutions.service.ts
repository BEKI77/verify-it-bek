import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { CreateCertificateDto } from 'src/certificate/dto/create-certificate.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { DB } from 'src/db/db.module';
import { DrizzleDB } from 'src/db/types/db';
import { certificates } from 'src/db/schema/certificate.schema';
import { institutions } from 'src/db/schema/institution.schema';
import { eq } from 'drizzle-orm';
import { CertificateService } from 'src/certificate/certificate.service';

@Injectable()
export class InstitutionsService {
  constructor(
    @Inject(DB)
    private readonly db: DrizzleDB,
    private readonly certificatService: CertificateService
  ){}

  async register(dto: CreateInstitutionDto, userId: number) {
    const institution = await this.db.insert(institutions).values({
      ...dto,
      approved: false,
      userId,
    }).returning();

    return institution[0];
  }

  async issueCertificate(dto: CreateCertificateDto, userId: number) {
    // 1. Find institution owned by user
    const institution = await this.db.query.institutions.findFirst({
      where: (i) => eq(i.userId, userId),
    });

    if (!institution || !institution.approved)
      throw new ForbiddenException('Institution not found or not approved');

    const certificate = await this.certificatService.issueCertificate(dto, institution.id);


    return certificate;
  }

  async getMyCertificates(userId: number) {
    const institution = await this.db.query.institutions.findFirst({
      where: (i) => eq(i.userId, userId),
    });

    if (!institution) throw new NotFoundException('Institution not found');

    return this.db.select().from(certificates).where(eq(certificates.institutionId, institution.id));
  }

  async revokeCertificate(certId: number, userId: number) {
    const institution = await this.db.query.institutions.findFirst({
      where: (i) => eq(i.userId, userId),
    });
    if (!institution) throw new NotFoundException('Institution not found');

    const cert = await this.db.select().from(certificates).where(eq(certificates.id, certId));

    if (!cert[0] || cert[0].institutionId !== institution.id)
      throw new ForbiddenException('Certificate not found or not yours');

    await this.db.update(certificates)
      .set({ verified: false })
      .where(eq(certificates.id, certId));
  }
}
