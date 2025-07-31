import { pgTable, varchar, boolean, timestamp, text, uuid, integer } from 'drizzle-orm/pg-core';
import { institutions } from './institution.schema';

export const certificates = pgTable('certificates', {
  id: uuid('user_id').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  program: varchar('program', { length: 255 }).notNull(),
  fieldOfStudy: text('field_of_study').notNull(),
  institutionId: integer('institution_id').references(() => institutions.id).notNull(),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  fileUrl: varchar('file_url', { length: 500 }),
  verified: boolean('verified').default(false),
  hash: varchar('hash', { length: 128 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});