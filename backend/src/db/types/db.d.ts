import * as schema from '../schema/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzleDB = NodePgDatabase<typeof schema>;

export enum UserRole {
  admin = 'admin',
  institution = 'institution',
  user = 'user',
}
