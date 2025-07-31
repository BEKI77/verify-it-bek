import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from 'src/db/db.module';
import { PasswordHasherService } from 'src/password-hasher/password-hasher.service';
import { DecoderService } from 'src/decoder/decoder.service';

@Module({
  imports: [DbModule],
  controllers: [UserController],
  providers: [UserService, PasswordHasherService, DecoderService],
})
export class UserModule {}
