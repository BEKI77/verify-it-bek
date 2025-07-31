import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { DbModule } from 'src/db/db.module';
import { DecoderService } from 'src/decoder/decoder.service';

@Module({
  imports: [ DbModule ],
  controllers: [ CertificateController ],
  providers: [CertificateService, DecoderService],
})
export class CertificateModule {}
