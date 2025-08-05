import { pgTable, serial, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('role', ['admin', 'institution', 'verifier', 'student']);
export const registrationTypeEnum = pgEnum('registration_type', ['fayda', 'email']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  imageUrl: text('imageUrl'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  registrationType: registrationTypeEnum('registration_type').notNull(),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});