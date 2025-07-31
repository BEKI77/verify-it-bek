import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller'
import { DbModule } from 'src/db/db.module';
import { CertificateService } from 'src/certificate/certificate.service';
import { DecoderService } from 'src/decoder/decoder.service';

@Module({
  imports:[DbModule],
  controllers: [InstitutionsController],
  providers: [InstitutionsService, CertificateService, DecoderService],
})
export class InstitutionsModule {}
