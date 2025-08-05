import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import { PasswordHasherService } from 'src/password-hasher/password-hasher.service';
import { importJWK, SignJWT } from 'jose';
import * as jose from 'jose';
import { DB } from 'src/db/db.module';
import { DrizzleDB } from 'src/db/types/db';
import { eq } from 'drizzle-orm';
import { users } from 'src/db/schema/user.schema';
@Injectable()
export class AuthService {
  constructor(
    @Inject(DB)
    private readonly db: DrizzleDB,
    private readonly userService: UserService,
    private readonly passwordHasher: PasswordHasherService
  ) {}

  async signUp(createAuthDto: CreateAuthDto) {
    const { email } = createAuthDto;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userService.createUser({ ...createAuthDto, imageUrl: '' });

    const token = jwt.sign(
      { userId: newUser.id, new: newUser.email, role: newUser.role },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return { 
      id: newUser.id, 
      email: newUser.email, 
      role:newUser.role, 
      registerType:newUser.registrationType,
      token
    };
  }

  async signIn(email: string, password: string) {

    const user = await this.db.select().from(users).where(eq(users.email, email));

    if (!user || user[0].registrationType === 'fayda') {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Verify the password
    const isPasswordValid = await this.passwordHasher.compare(password, user[0].passwordHash);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email, role: user[0].role },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return { 
      id: user[0].id, 
      email: user[0].email, 
      role:user[0].role, 
      registerType:user[0].registrationType,
      token
    };
  }

  async generateSignedJwt (){
    const {
      CLIENT_ID,
      TOKEN_ENDPOINT,
      PRIVATE_KEY
    } = process.env;

    if(!CLIENT_ID||!TOKEN_ENDPOINT||!PRIVATE_KEY){
      console.log("Check the .env file for CLIENT_ID or TOKEN_ENDPOINT or PRIVATE_KEY");
      throw new Error("Environmental variable error");
    }

    const header = { alg: 'RS256', typ: 'JWT' };

    const payload = {
      iss: CLIENT_ID,
      sub: CLIENT_ID,
      aud: TOKEN_ENDPOINT
    };

    const jwkJson = Buffer.from(PRIVATE_KEY, 'base64').toString();
    const jwk = JSON.parse(jwkJson);
    const privateKey = await importJWK(jwk, 'RS256');

    return await new SignJWT(payload)
      .setProtectedHeader(header)
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(privateKey);
    };

  async decodeUserInfoResponse(userinfoJwtToken: any) {
    try {
      return jose.decodeJwt(userinfoJwtToken);
    } catch (error) {
      console.error('Error decoding JWT user info:', error);
      return null;
    }
  }

}