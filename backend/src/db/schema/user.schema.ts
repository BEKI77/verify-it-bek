import { pgTable, serial, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('role', ['admin', 'institution', 'user']);
export const registrationTypeEnum = pgEnum('registration_type', ['fayda', 'email']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fan: varchar('fan', { length: 50 }),
  fin: varchar('fin', { length: 50 }),
  registrationType: registrationTypeEnum('registration_type').notNull(),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});