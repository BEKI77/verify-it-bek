import { Inject, Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import * as QRCode from 'qrcode';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
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
    const year = new Date().getFullYear();
    const uniqueNumber = uuidv4(); 
    const certificateId = `/${year}/${uniqueNumber}`;

    const hash = this.generateHash({
      ...dto,
      certificateId,
    });

    const newCert = await this.db.insert(certificates).values({
      ...dto,
      certificateId,
      hash,
      status: 'valid',
      createdAt: new Date(),
      program: dto.degree,
      issuedAt: new Date(dto.issuedAt),
    }).returning();

    const pdfPath = await this.generateCertificatePdf(newCert[0]);

    return {
      ...newCert[0],
      pdfPath,
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
    const outputPath = path.join(__dirname, '../../public/certificates', `${cert.certificateId}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    doc.fontSize(20).text('VeriFayda Certificate', { align: 'center' }).moveDown();
    doc.fontSize(14);
    doc.text(`Name: ${cert.fullName}`);
    doc.text(`Degree: ${cert.degree}`);
    doc.text(`Field of Study: ${cert.fieldOfStudy}`);
    doc.text(`Issued At: ${new Date(cert.issuedAt).toDateString()}`);
    doc.text(`Certificate ID: ${cert.certificateId}`);

    const qrLink = `https://yourdomain.com/verify?certificateId=${cert.certificateId}`;
    const qrDataUrl = await QRCode.toDataURL(qrLink);

    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    doc.image(qrBuffer, { fit: [150, 150], align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }

}
