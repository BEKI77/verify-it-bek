import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { DbModule } from 'src/db/db.module';
import { DecoderService } from 'src/decoder/decoder.service';

@Module({
  imports: [ DbModule ],
  controllers: [],
  providers: [CertificateService, DecoderService],
})
export class CertificateModule {}
