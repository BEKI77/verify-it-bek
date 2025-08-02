import { pgTable, serial, varchar, integer, timestamp, pgEnum, text, uuid } from 'drizzle-orm/pg-core';
import { certificates } from './certificate.schema';

export const verificationStatusEnum = pgEnum('status', ['valid', 'invalid', 'pending']);

export const verifications = pgTable('verifications', {
  id: serial('id').primaryKey(),
  certificateId: uuid('certificate_id').references(() => certificates.certificateId).notNull(),
  verifiedByIp: varchar('verified_by_ip', { length: 45 }).notNull(),
  status: verificationStatusEnum('status').notNull(),
  checkedAt: timestamp('checked_at', { withTimezone: true }).defaultNow(),
  notes: text('notes')
});