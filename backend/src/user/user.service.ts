// src/user/user.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { users } from 'src/db/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { DB } from 'src/db/db.module';
import { DrizzleDB } from 'src/db/types/db';
import { PasswordHasherService } from 'src/password-hasher/password-hasher.service';

const userPublicSelect = {
  id: users.id,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

@Injectable()
export class UserService {
  constructor(
    @Inject(DB) 
    private readonly db: DrizzleDB,
    private readonly passwordHasher: PasswordHasherService
  ) {}

  async findAll() {
    const  users_data  =  await this.db.select(userPublicSelect).from(users);
    return users_data;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(user_data: CreateUserDto) {

    const { password } = user_data;
    const hashedPassword = await this.passwordHasher.hash(password);

    

    const isFayda = user_data.registrationType === 'fayda';

    const  [ user ]  = await this.db
      .insert(users)
      .values({
        email: user_data.email,
        passwordHash: hashedPassword,
        role: user_data.role || 'user',
        registrationType: user_data.registrationType==='email'? 'email':'fayda',
        fin: isFayda ? user_data.fin : null,
        fan: isFayda ? user_data.fan : null
      })
      .returning();

    if(!user){
      throw new Error("User creation failed");
    }

    const { passwordHash, ...rest } = user;
    
    return rest;
  }
}
