import { pgTable, serial, varchar, boolean, integer } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const institutions = pgTable('institutions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  address: varchar('address', { length: 255 }),
  website: varchar('website', { length: 255 }),
  approved: boolean('approved').default(false),
  userId: integer('user_id').references(() => users.id).notNull()
});