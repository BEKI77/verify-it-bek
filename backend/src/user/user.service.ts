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
    const hashedPassword = await this.passwordHasher.hash(user_data.password);
    const  [ user ]  = await this.db
    .insert(users)
    .values({
      ...user_data,  
      passwordHash: hashedPassword,
      role: user_data.role || 'user'
    })
    .returning();

    if(!user){
      throw new Error("User creation failed");
    }

    const { passwordHash, ...rest } = user;
    
    return rest;
  }
}
