import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import { PasswordHasherService } from 'src/password-hasher/password-hasher.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordHasher: PasswordHasherService
  ) {}

  async signUp(createAuthDto: CreateAuthDto) {
    const { email } = createAuthDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userService.createUser(createAuthDto);

    return { id: newUser.id, email: newUser.email };
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Verify the password
    const isPasswordValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return token;
  }

}