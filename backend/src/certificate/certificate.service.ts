import { supabase } from 'lib/supabase';
import { Inject, Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import * as QRCode from 'qrcode';
import * as PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import { certificates } from 'src/db/schema/certificate.schema';
import { DB } from 'src/db/db.module';
import { DrizzleDB } from 'src/db/types/db';

@Injectable()
export class CertificateService {
  constructor(
      @Inject(DB) 
      private readonly db: DrizzleDB,
  ) {}
  
  async createCertificate(dto: CreateCertificateDto) {
    const certificateId = uuidv4(); 

    const hash = this.generateHash({
      ...dto,
      certificateId,
    });

    const newCert = await this.db.insert(certificates).values({
      ...dto,
      institutionName: dto.uni_name,
      institutionsEmail: dto.uni_email,
      certificateId,
      hash,
      status: 'valid',
      createdAt: new Date(),
      program: dto.degree,
      issuedAt: new Date(dto.issuedAt),
    }).returning();

    const pdfUrl = await this.generateCertificatePdf(newCert[0]);
   
    return {
      ...newCert[0],
      pdfUrl,
    };
  }

  private generateHash(data: {
    fullName: string;
    degree: string;
    fieldOfStudy: string;
    issuedAt: string;
    certificateId: string;
    institutionId: number;
  }) {
    const raw = `${data.fullName}|${data.degree}|${data.fieldOfStudy}|${data.issuedAt}|${data.certificateId}|${data.institutionId}`;
    return createHash('sha256').update(raw).digest('hex');
  }

  private async generateCertificatePdf(cert: any): Promise<string> {
    const bufferChunks: any[] = [];

    const qrCodeDataURL = await QRCode.toDataURL(cert.certificateId);


    const doc = new PDFDocument();
    const stream = new PassThrough();

    doc.pipe(stream);
    stream.on('data', chunk => bufferChunks.push(chunk));

    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
    .lineWidth(4)
    .strokeColor('#2c3e50')
    .stroke();

    // === Header Title ===
    doc.fontSize(26)
    .fillColor('#1a1a1a')
    .font('Times-Bold')
    .text(`${cert.institutionName} Certificate of Achievement`, {
      align: 'center',
      underline: true,
    })
    .moveDown(1.5);
     
    // === Recipient Section ===
    doc.fontSize(16)
    .font('Times-Roman')
    .text(`This is to certify that`, { align: 'center' })
    .moveDown(0.5);
     
    doc.fontSize(22)
    .font('Times-Bold')
    .fillColor('#000000')
    .text(cert.fullName, { align: 'center' })
    .moveDown(0.5);
     
    doc.fontSize(16)
    .font('Times-Roman')
    .fillColor('#1a1a1a')
    .text(`has successfully completed the program`, { align: 'center' })
    .moveDown(0.5);
     
    doc.fontSize(18)
    .font('Times-Italic')
    .text(`${cert.program} in ${cert.fieldOfStudy}`, { align: 'center' })
    .moveDown(1.5);
     
    // === Issuance Details ===
    doc.fontSize(14)
    .font('Times-Roman')
    .text(`Issued On: ${new Date(cert.issuedAt).toDateString()}`, { align: 'left' });
     
    doc.text(`Certificate ID: ${cert.certificateId}`, { align: 'left' });

    doc.text(`Institution Email: ${cert.institutionsEmail}`, { align: 'left' });
     
    // === Signature and QR Code ===
    const signatureY = doc.y + 50;
     
    // Optional: Signature placeholder
    doc.fontSize(14)
    .font('Times-Italic')
    .text('______________________', 60, signatureY);

    doc.text('Authorized Signature', 60, signatureY + 15);
     
    // Insert QR Code on the right
    const qrBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
    doc.image(qrBuffer, doc.page.width - 200, signatureY - 30, {
      fit: [120, 120],
      align: 'right',
    });

    doc.end();

    await new Promise(resolve => doc.on('end', resolve));

    const pdfBuffer = Buffer.concat(bufferChunks);

    const { data, error } = await supabase.storage
    .from('certificates')
    .upload(`${cert.certificateId}.pdf`, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: publicUrl } = supabase.storage
    .from('certificates')
    .getPublicUrl(`${cert.certificateId}.pdf`);

    return publicUrl?.publicUrl!;

  }


}
