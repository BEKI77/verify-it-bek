import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Post('signUp')
  async signUp(@Body() createAuthDto: CreateAuthDto) {
    try {
      const result = await this.authService.signUp(createAuthDto);
      return { message: 'User registered successfully', data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signIn')
  async signIn(@Body() credentials: { email: string; password: string }) {
    try {
      const token = await this.authService.signIn(credentials.email, credentials.password);
      return { message: 'Sign-in successful', token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

}
