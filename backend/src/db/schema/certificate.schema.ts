import { pgTable, serial, varchar, integer, boolean, timestamp, text } from 'drizzle-orm/pg-core';
import { institutions } from './institution.schema';

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  certificateId: varchar('certificate_id', { length: 100 }).notNull().unique(),
  program: varchar('program', { length: 255 }).notNull(),
  institutionId: integer('institution_id').references(() => institutions.id).notNull(),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  fileUrl: varchar('file_url', { length: 500 }).notNull(),
  verified: boolean('verified').default(false),
  hash: varchar('hash', { length: 128 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});