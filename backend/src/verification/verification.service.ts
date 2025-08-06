import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB } from 'src/db/db.module';
import { DrizzleDB } from 'src/db/types/db';
import { certificates } from 'src/db/schema/certificate.schema';
import { eq } from 'drizzle-orm';
import { verifications } from 'src/db/schema/verification.schema';
import { createClient } from '@supabase/supabase-js';
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

    const supabase = await createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

    const pdfUrl = `${await supabase.storage.from('certificates').getPublicUrl(cert.certificateId).data.publicUrl}.pdf`;

    return {
      valid: true,
      certificate: {
        ...cert,
        pdfUrl
      },
    };
  }

  async logVerification(logData: {
    certificateId: string;
    verifiedByIp: string;
    status: 'valid' | 'invalid' | 'pending';
    notes: string | null;
  }) {
  
    await this.db.insert(verifications).values({
      certificateId: logData.certificateId,
      verifiedByIp: logData.verifiedByIp,
      status: logData.status,
      notes: logData.notes,
    });
  }
}
