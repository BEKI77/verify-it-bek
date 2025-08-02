import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserService } from 'src/user/user.service';
import { InstitutionsService } from 'src/institutions/institutions.service';
import { PasswordHasherService } from 'src/password-hasher/password-hasher.service';
import {  DbModule } from 'src/db/db.module';
import { CertificateService } from 'src/certificate/certificate.service';
import { DecoderService } from 'src/decoder/decoder.service';

@Module({
  imports: [DbModule],
  controllers: [AdminController],
  providers: [
    AdminService, 
    UserService, 
    InstitutionsService,
    DecoderService,
    PasswordHasherService,
    CertificateService
  ],
})
export class AdminModule {}
