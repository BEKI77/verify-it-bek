import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordHasherService } from 'src/password-hasher/password-hasher.service';
import { UserService } from 'src/user/user.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordHasherService, UserService],
})
export class AuthModule {}
