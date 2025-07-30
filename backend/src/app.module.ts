import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { PasswordHasherService } from './password-hasher/password-hasher.service';
import { InstitutionsModule } from './institutions/institutions.module';
import { CertificateModule } from './certificate/certificate.module';
import { VerificationModule } from './verification/verification.module';
import { AdminModule } from './admin/admin.module';
import { DecoderService } from './decoder/decoder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    DbModule,
    InstitutionsModule,
    CertificateModule,
    VerificationModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    PasswordHasherService,
    DecoderService,
  ],
})
export class AppModule {}
