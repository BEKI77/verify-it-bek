import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB } from 'src/db/db.module';
import { DrizzleDB } from 'src/db/types/db';
import { certificates } from 'src/db/schema/certificate.schema';
import { eq } from 'drizzle-orm';
@Injectable()
export class VerificationService {
  constructor(
    @Inject(DB)
    private readonly db: DrizzleDB,
  ){}
  async verifyCertificateById(certificateId: string) {
    const [cert] = await this.db.select().from(certificates).where(eq(certificates.certificateId, certificateId));

    if (!cert) {
      throw new NotFoundException('Certificate not found');
    }

    if (cert.status === 'revoked') {
      return {
        valid: false,
        reason: 'Certificate has been revoked',
        certificate: null,
      };
    }

    return {
      valid: true,
      certificate: {
        fullName: cert.fullName,
        degree: cert.program,
        fieldOfStudy: cert.fieldOfStudy,
        issuedAt: cert.issuedAt,
        certificateId: cert.certificateId,
        institution: cert.institutionId,
      },
    };
  }
}
