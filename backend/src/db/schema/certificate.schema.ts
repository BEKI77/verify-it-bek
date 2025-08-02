import { pgTable, varchar, boolean, timestamp, text, serial, integer, uuid,pgEnum } from 'drizzle-orm/pg-core';
import { institutions } from './institution.schema';

export const statusEum = pgEnum('revokeStatus', ['valid', 'revoked']);

export const certificates = pgTable('certificates', {
  certificateId: uuid('certificateId').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  program: varchar('program', { length: 255 }).notNull(),
  fieldOfStudy: text('field_of_study').notNull(),
  institutionId: integer('institution_id').references(() => institutions.id).notNull(),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  status: statusEum('status').notNull(),
  fileUrl: varchar('file_url', { length: 500 }),
  verified: boolean('verified').default(false),
  hash: varchar('hash', { length: 128 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});