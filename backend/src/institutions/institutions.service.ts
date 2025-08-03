import { Inject, Injectable, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { CreateCertificateDto } from 'src/certificate/dto/create-certificate.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { DB } from 'src/db/db.module';
import { DrizzleDB } from 'src/db/types/db';
import { certificates } from 'src/db/schema/certificate.schema';
import { institutions } from 'src/db/schema/institution.schema';
import { eq } from 'drizzle-orm';
import { CertificateService } from 'src/certificate/certificate.service';
import { UUID } from 'crypto';
import { DecoderService } from 'src/decoder/decoder.service';
import { Request } from 'express';
@Injectable()
export class InstitutionsService {
  constructor(
    @Inject(DB)
    private readonly db: DrizzleDB,
    private readonly decoderService: DecoderService,
    private readonly certificatService: CertificateService
  ){}

  async getInfo(req: Request){
    const user = this.decoderService.decode(req);
    const institute = await this.db.select().from(institutions).where(eq(institutions.userId, user.userId));

    if(!institute)
      throw new NotFoundException("Coundn't find an institution with this user id")
    
    return institute[0];
  }

  async register(dto: CreateInstitutionDto, userId: number) {
    const institution = await this.db.insert(institutions).values({
      ...dto,
      approved: false,
      userId,
    }).returning();

    return institution[0];
  }

  async issueCertificate(dto: CreateCertificateDto, userId: number) {

    const institution = await this.db.select()
    .from(institutions)
    .where(eq(institutions.userId, userId))
    .limit(1);
     

    if (!institution || !institution[0].approved)
      throw new ForbiddenException('Institution not found or not approved');

    if(institution[0].id !== dto.institutionId)
      throw new UnauthorizedException('Institution not allowed to ')

    const certificate = await this.certificatService.createCertificate({
      ...dto, 
      uni_email:institution[0].email,
      uni_name: institution[0].name,
    });

    return certificate;
  }

  async getMyCertificates(userId: number) {
    const [ institute ] = await this.db.select().from(institutions).where(eq(institutions.userId,userId)).limit(1)

    const certs = await this.db.select().from(certificates).where(eq(certificates.institutionId, institute.id));

    return certs;
  }

  async revokeCertificate(certId: UUID, userId: number) {
    const institution = await this.db.select().from(institutions).where(eq(institutions.userId, userId));
 
    if (!institution) throw new NotFoundException('Institution not found');

    const cert = await this.db.select().from(certificates).where(eq(certificates.certificateId, certId));

    if (!cert[0] || cert[0].institutionId !== institution[0].id)
      throw new ForbiddenException('Certificate not found or not yours');

    await this.db.update(certificates)
      .set({ verified: false })
      .where(eq(certificates.certificateId, certId));
  }
}
