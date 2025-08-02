import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller'
import { DbModule } from 'src/db/db.module';
import { CertificateService } from 'src/certificate/certificate.service';
import { DecoderService } from 'src/decoder/decoder.service';
import { UserService } from 'src/user/user.service';
import { PasswordHasherService } from 'src/password-hasher/password-hasher.service';

@Module({
  imports:[DbModule],
  controllers: [InstitutionsController],
  providers: [
    InstitutionsService, 
    CertificateService, 
    UserService, 
    PasswordHasherService,
    DecoderService
  ],
})
export class InstitutionsModule {}
