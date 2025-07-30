import { pgTable, serial, integer, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  data: jsonb('data'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});